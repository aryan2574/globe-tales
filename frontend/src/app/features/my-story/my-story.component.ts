import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStoryService } from '../../services/user-story.service';
import { UserStory } from '../../models/user-story.model';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-story',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-story.component.html',
  styleUrls: ['./my-story.component.scss'],
})
export class MyStoryComponent implements OnInit {
  stories: UserStory[] = [];
  selectedStory: UserStory | null = null;
  newStory: Partial<UserStory> = { title: '', content: '' };
  isLoggedIn$: Observable<boolean>;
  visitedStories: UserStory[] = [];

  constructor(
    private userStoryService: UserStoryService,
    private authService: AuthService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    this.isLoggedIn$.subscribe((loggedIn) => {
      if (loggedIn) {
        this.loadStories();
        this.loadVisitedSites();
      } else {
        this.stories = [];
        this.visitedStories = [];
      }
    });
  }

  loadStories(): void {
    this.userStoryService.getStories().subscribe((stories) => {
      this.stories = stories;
    });
  }

  loadVisitedSites(): void {
    this.userStoryService.getVisitedSites().subscribe((stories) => {
      this.visitedStories = stories;
    });
  }

  selectStory(story: UserStory): void {
    this.selectedStory = { ...story };
  }

  createNewStory(): void {
    this.selectedStory = null;
    this.newStory = { title: '', content: '' };
  }

  saveStory(): void {
    if (this.selectedStory && this.selectedStory.id) {
      this.userStoryService
        .updateStory(this.selectedStory.id, this.selectedStory)
        .subscribe(() => {
          this.loadStories();
          this.selectedStory = null;
        });
    } else {
      const userId = this.authService.getUserId();
      if (!userId) {
        console.error('User not logged in');
        return;
      }
      const storyToCreate: UserStory = {
        ...this.newStory,
        userId: userId,
      } as UserStory;
      this.userStoryService.createStory(storyToCreate).subscribe(() => {
        this.loadStories();
        this.newStory = { title: '', content: '' };
      });
    }
  }

  deleteStory(id: string): void {
    this.userStoryService.deleteStory(id).subscribe(() => {
      this.loadStories();
      if (this.selectedStory && this.selectedStory.id === id) {
        this.selectedStory = null;
      }
    });
  }

  downloadStory(story: UserStory): void {
    const text = `Title: ${story.title}\n\n${story.content}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title || 'story'}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

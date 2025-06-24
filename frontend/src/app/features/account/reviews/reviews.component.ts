import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaceReview } from '../../../models/place-review.model';
import { PlaceReviewService } from '../../../services/place-review.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  reviews: PlaceReview[] = [];
  loading = false;
  error: string | null = null;
  user: any = null;
  selectedReview: Partial<PlaceReview> | null = null;
  isNewReview = false;

  constructor(
    private placeReviewService: PlaceReviewService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.loadReviews();
      }
    });
  }

  private loadReviews() {
    this.loading = true;
    this.placeReviewService.getReviewsByUserId(this.user.id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load reviews';
        this.loading = false;
      },
    });
  }

  editReview(review: PlaceReview): void {
    this.selectedReview = { ...review };
    this.isNewReview = false;
  }

  createNewReview(): void {
    this.selectedReview = {
      placeName: '',
      comment: '',
      rating: 5,
      userId: this.user.id,
    };
    this.isNewReview = true;
  }

  saveReview(): void {
    if (!this.selectedReview) return;

    if (this.isNewReview) {
      this.placeReviewService
        .createReview(this.selectedReview)
        .subscribe(() => {
          this.loadReviews();
          this.cancelEdit();
        });
    } else {
      this.placeReviewService
        .updateReview(this.selectedReview.id!, this.selectedReview)
        .subscribe(() => {
          this.loadReviews();
          this.cancelEdit();
        });
    }
  }

  deleteReview(id: string): void {
    this.placeReviewService.deleteReview(id).subscribe(() => {
      this.loadReviews();
    });
  }

  cancelEdit(): void {
    this.selectedReview = null;
    this.isNewReview = false;
  }
}

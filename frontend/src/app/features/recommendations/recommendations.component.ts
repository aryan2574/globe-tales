import { Component, OnInit } from '@angular/core';
import { Recommendation } from '../../models/recommendation.model';
import { RecommendationService } from '../../services/recommendation.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DistancePipe } from '../../pipes/distance.pipe';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { UserService } from '../../services/user.service';
import { LocationService } from '../../services/location.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule, DistancePipe, DurationPipe],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
})
export class RecommendationsComponent implements OnInit {
  transportMode: string = 'foot-walking';
  maxDistance: number = 5; // default distance in km
  recommendations: Recommendation[] = [];
  isLoading: boolean = false;
  hasMore: boolean = false;
  currentPage: number = 0;
  locationMissing: boolean = false;

  private distanceChanged: Subject<number> = new Subject<number>();
  private user: User | null = null;

  constructor(
    private recommendationService: RecommendationService,
    private userService: UserService,
    private locationService: LocationService
  ) {
    this.distanceChanged
      .pipe(
        debounceTime(500), // wait 500ms after the last event
        distinctUntilChanged()
      )
      .subscribe((distance) => {
        this.maxDistance = distance;
        this.resetAndFetch(false); // Don't use cache on slider change for smoother UX
      });
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user) => {
      this.user = user;
      if (user && user.latitude && user.longitude) {
        this.locationMissing = false;
        this.resetAndFetch(true); // Use cache on initial load
      } else {
        this.locationMissing = true;
        this.isLoading = false;
      }
    });
  }

  requestLocation(): void {
    this.isLoading = true;
    this.locationService.getCurrentLocation().subscribe({
      next: (position: any) => {
        const { latitude, longitude } = position;
        this.userService
          .updateCurrentUserLocation({ latitude, longitude })
          .subscribe(() => {
            this.isLoading = false;
          });
      },
      error: (error: any) => {
        console.error('Error getting location', error);
        this.locationMissing = true;
        this.isLoading = false;
      },
    });
  }

  setTransportMode(mode: string): void {
    if (this.transportMode === mode) return;
    this.transportMode = mode;
    this.resetAndFetch(true);
  }

  onDistanceChange(distance: number): void {
    this.distanceChanged.next(distance);
  }

  resetAndFetch(useCache: boolean): void {
    if (this.locationMissing) return; // Don't fetch if location is missing
    this.currentPage = 0;
    this.recommendations = [];
    this.hasMore = false;
    this.fetchRecommendations(useCache);
  }

  fetchRecommendations(useCache: boolean = false): void {
    const cacheKey = `recs-${this.transportMode}-${this.maxDistance}`;

    if (useCache) {
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        const response = JSON.parse(cachedData);
        this.recommendations = response.recommendations;
        this.hasMore = response.hasMore;
        this.isLoading = false; // Already have data to show
      }
    }

    if (this.currentPage === 0) {
      this.isLoading = true; // Only show main loader on initial fetch
    }

    this.recommendationService
      .getRecommendations(
        this.transportMode,
        this.maxDistance * 1000,
        this.currentPage
      )
      .subscribe(
        (response) => {
          if (this.currentPage === 0) {
            this.recommendations = response.recommendations;
          } else {
            this.recommendations.push(...response.recommendations);
          }
          this.hasMore = response.hasMore;

          if (this.currentPage === 0) {
            sessionStorage.setItem(
              cacheKey,
              JSON.stringify({
                recommendations: this.recommendations,
                hasMore: this.hasMore,
              })
            );
          }

          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching recommendations', error);
          this.isLoading = false;
        }
      );
  }

  loadMore(): void {
    if (!this.hasMore || this.isLoading) return;
    this.currentPage++;
    this.fetchRecommendations(false); // Don't use cache when loading more
  }
}

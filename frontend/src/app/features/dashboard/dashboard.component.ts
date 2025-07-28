import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DistancePipe } from '../../pipes/distance.pipe';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { MapService } from '../../services/map.service';
import { LocationService, Location } from '../../services/location.service';
import { PlacesService } from '../../services/places.service';
import { RouteService } from '../../services/route.service';
import { Place } from '../../models/place.model';
import { RouteInfo } from '../../models/route.model';
import { UserFavouriteService } from '../../services/user-favourite.service';
import { AuthService } from '../../services/auth.service';
import { MapComponent } from '../../shared/components/map/map.component';
import { WeatherWidgetComponent } from '../../shared/components/weather-widget/weather-widget.component';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { VisitedSiteService } from '../../services/visited-site.service';
import { VisitedSite } from '../../models/visited-site.model';
import { UserStoryService } from '../../services/user-story.service';
import { PlaceReviewService } from '../../services/place-review.service';
import { PlaceReview } from '../../models/place-review.model';
import { RecommendationsComponent } from '../recommendations/recommendations.component';

type TransportMode = 'driving-car' | 'foot-walking' | 'cycling-regular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DistancePipe,
    DurationPipe,
    MapComponent,
    WeatherWidgetComponent,
    RecommendationsComponent,
  ],
  providers: [PlacesService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  places: Place[] = [];
  selectedPlace: Place | null = null;
  selectedType: string = 'attraction';
  searchRadius: number = 2000;
  loading: boolean = false;
  error: string | null = null;
  hasLocation: boolean = false;
  routeInfo: RouteInfo | null = null;
  transportMode: TransportMode = 'driving-car';
  private subscriptions: Subscription[] = [];
  private pendingMapInit = false;
  savedIds: Set<number> = new Set();
  visitedIds: Set<string> = new Set();
  savingFavouriteId: number | null = null;
  savingVisitedId: number | null = null;
  currentLatitude: number | null = null;
  currentLongitude: number | null = null;
  private locationSubscription!: Subscription;
  private currentUser!: User;
  private hasFetchedPlaces = false;
  private visitedSites: VisitedSite[] = [];
  userReviews: PlaceReview[] = [];
  selectedPlaceForReview: Place | null = null;
  reviewForm: {
    rating: number;
    comment: string;
    placeId?: string;
    placeName?: string;
    id?: string;
  } | null = null;
  favourites: Place[] = [];

  constructor(
    private mapService: MapService,
    private locationService: LocationService,
    private placesService: PlacesService,
    private routeService: RouteService,
    private router: Router,
    private userFavouriteService: UserFavouriteService,
    private authService: AuthService,
    private userService: UserService,
    private visitedSiteService: VisitedSiteService,
    private placeReviewService: PlaceReviewService
  ) {}

  ngOnInit(): void {
    // On load, get user and use saved location
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user.latitude && user.longitude) {
          this.currentLatitude = user.latitude;
          this.currentLongitude = user.longitude;
          this.hasLocation = true;
          this.searchNearbyPlaces(); // Initial search on load
        } else {
          this.hasLocation = false;
          this.error = 'Please allow location to view nearby places';
        }
        // Fetch favourites for the user
        this.userFavouriteService.getFavouritesByUser(user.id).subscribe({
          next: (favs) => {
            // For each favourite, fetch the place details
            const placeObservables = favs.map((fav) =>
              this.placesService.getPlaceByOsmId(fav.siteId.toString())
            );
            Promise.all(placeObservables.map((o) => o.toPromise())).then(
              (places) => {
                this.favourites = places.filter((p): p is Place => !!p);
              }
            );
          },
          error: (err) => {
            // Ignore error, just don't show favourites
            this.favourites = [];
          },
        });
      },
      error: (err) => {
        this.error = 'Failed to load user data.';
        this.hasLocation = false;
      },
    });
    this.loadSavedVisited();
    this.loadVisitedSites();
    this.loadUserReviews();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
    this.mapService.destroyMap();
    this.onTypeChange();
  }

  fetchAndLoadPlaces(): void {
    if (this.currentLatitude === null || this.currentLongitude === null) return;
    this.searchNearbyPlaces();
  }

  updateLocation(): void {
    this.error = null;
    // Only use geolocation when user clicks update
    this.loading = true;
    this.locationService.requestAndSaveLocation().subscribe({
      next: (location) => {
        this.userService.updateCurrentUserLocation(location).subscribe(() => {
          this.currentLatitude = location.latitude;
          this.currentLongitude = location.longitude;
          this.hasLocation = true;
          this.searchNearbyPlaces();
          this.loading = false;
        });
      },
      error: (err: any) => {
        this.error = err.message;
        this.loading = false;
      },
    });
    this.routeInfo = null;
  }

  async searchNearbyPlaces(): Promise<void> {
    this.loading = true;
    this.error = null;

    if (this.currentLatitude === null || this.currentLongitude === null) {
      this.error = 'Location not available.';
      this.loading = false;
      return;
    }

    try {
      this.mapService
        .searchPlaces(
          this.currentLatitude,
          this.currentLongitude,
          this.searchRadius,
          this.selectedType
        )
        .subscribe({
          next: (places) => {
            this.places = places;
          },
          error: (error) => {
            this.error = 'Failed to load places. Please try again.';
          },
          complete: () => {
            this.loading = false;
          },
        });
    } catch (error) {
      this.error = 'Failed to load places. Please try again.';
    }
  }

  async selectPlace(place: Place): Promise<void> {
    if (this.currentLatitude == null || this.currentLongitude == null) {
      this.error = 'Your location is not available. Cannot calculate route.';
      return;
    }

    this.selectedPlace = place;
    try {
      this.routeService
        .getRoute(
          [this.currentLatitude, this.currentLongitude],
          [place.latitude, place.longitude],
          this.transportMode
        )
        .subscribe({
          next: (routeInfo) => {
            this.routeInfo = routeInfo;
          },
          error: (error) => {
            this.error = 'Failed to get route. Please try again.';
          },
        });
    } catch (error) {
      this.error = 'Failed to get current location. Please try again.';
    }
  }

  async getRoute(transportMode: TransportMode): Promise<void> {
    if (!this.selectedPlace) {
      this.error = 'Please select a destination first';
      return;
    }

    this.transportMode = transportMode;
    this.loading = true;
    this.error = null;

    if (this.currentLatitude === null || this.currentLongitude === null) {
      this.error = 'Current location not available.';
      this.loading = false;
      return;
    }

    const subscription = this.routeService
      .getRoute(
        [this.currentLatitude, this.currentLongitude],
        [this.selectedPlace.latitude, this.selectedPlace.longitude],
        transportMode
      )
      .subscribe({
        next: (routeInfo) => {
          this.routeInfo = routeInfo;
        },
        error: (error) => {
          this.error = 'Failed to get route. Please try again.';
        },
        complete: () => {
          this.loading = false;
        },
      });
    this.subscriptions.push(subscription);
  }

  async goToCurrentLocation(): Promise<void> {
    if (this.currentLatitude && this.currentLongitude) {
      this.mapService.flyTo([this.currentLatitude, this.currentLongitude]);
    } else {
      this.error = 'Your location is not available.';
    }
  }

  clearRoute(): void {
    this.routeInfo = null;
    this.mapService.clearRoute();
  }

  onTypeChange(): void {
    this.searchNearbyPlaces();
  }

  onRadiusChange(): void {
    this.searchNearbyPlaces();
  }

  loadSavedVisited(): void {
    this.savedIds.clear();
    this.visitedIds.clear();
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.userFavouriteService.getFavouritesByUser(user.id).subscribe({
      next: (favs) => {
        favs.forEach((fav) => this.savedIds.add(fav.siteId));
      },
    });
  }

  saveToFavorites(place: Place): void {
    if (this.savingFavouriteId === place.id || this.isPlaceSaved(place)) return;
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.savingFavouriteId = place.id;
    const payload = {
      userId: user.id,
      siteId: place.id,
      siteType: place.type,
      placeName: place.name,
    };
    this.userFavouriteService.createFavourite(payload).subscribe({
      next: () => {
        this.loadSavedVisited();
        this.userService.refreshCurrentUser();
      },
      error: (err) => {},
      complete: () => {
        this.savingFavouriteId = null;
      },
    });
  }

  isPlaceSaved(place: Place): boolean {
    return this.savedIds.has(place.id);
  }

  loadVisitedSites(): void {
    this.visitedIds.clear();
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.visitedSiteService.getVisitedSitesByUser(user.id).subscribe({
      next: (sites) => {
        this.visitedSites = sites;
        sites.forEach((site) => {
          if (site.placeId) this.visitedIds.add(site.placeId.toString());
        });
      },
    });
  }

  markAsVisited(place: Place): void {
    if (this.savingVisitedId === place.id || this.isPlaceVisited(place)) return;
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.savingVisitedId = place.id;
    const visitedSite: VisitedSite = {
      userId: user.id,
      placeId: place.id,
      placeName: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      visitedAt: new Date().toISOString(),
    };
    this.visitedSiteService.addVisitedSite(visitedSite).subscribe({
      next: () => {
        this.loadVisitedSites();
      },
      error: (err) => {},
      complete: () => {
        this.savingVisitedId = null;
      },
    });
  }

  isPlaceVisited(place: Place): boolean {
    return this.visitedIds.has(place.id.toString());
  }

  loadUserReviews(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;
    this.placeReviewService.getReviewsByUserId(userId).subscribe((reviews) => {
      this.userReviews = reviews;
    });
  }

  getReviewForPlace(placeId: string | number): PlaceReview | undefined {
    return this.userReviews.find((r) => r.placeId == placeId.toString());
  }

  openReviewForm(place: Place, event?: Event): void {
    if (event) event.stopPropagation();
    this.selectedPlaceForReview = place;
    const existingReview = this.getReviewForPlace(place.id);
    if (existingReview) {
      this.reviewForm = {
        id: existingReview.id,
        rating: existingReview.rating,
        comment: existingReview.comment,
        placeId: existingReview.placeId,
        placeName: existingReview.placeName,
      };
    } else {
      this.reviewForm = {
        rating: 5,
        comment: '',
        placeId: place.id.toString(),
        placeName: place.name,
      };
    }
  }

  saveReview(): void {
    if (!this.reviewForm || !this.selectedPlaceForReview) return;
    if (!this.currentUser) {
      alert('User data not loaded. Please try again.');
      return;
    }
    const reviewData: Partial<PlaceReview> = {
      ...this.reviewForm,
      userId: this.currentUser.id,
    };

    if (this.reviewForm.id) {
      // Update existing review
      this.placeReviewService
        .updateReview(this.reviewForm.id, reviewData)
        .subscribe(() => {
          this.loadUserReviews();
          this.cancelReview();
        });
    } else {
      // Create new review
      this.placeReviewService.createReview(reviewData).subscribe(() => {
        this.loadUserReviews();
        this.cancelReview();
      });
    }
  }

  cancelReview(): void {
    this.selectedPlaceForReview = null;
    this.reviewForm = null;
  }
}

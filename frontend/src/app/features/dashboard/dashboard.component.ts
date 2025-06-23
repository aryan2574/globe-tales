import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocationButtonComponent } from '../../shared/components/location-button/location-button.component';
import { DistancePipe } from '../../pipes/distance.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
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
import { UserStoryService } from '../../services/user-story.service';
import { UserStory } from '../../models/user-story.model';

type TransportMode = 'driving-car' | 'foot-walking' | 'cycling-regular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LocationButtonComponent,
    DistancePipe,
    DurationPipe,
    MapComponent,
    WeatherWidgetComponent,
  ],
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
  visitedStories: UserStory[] = [];
  savingFavouriteId: number | null = null;
  savingVisitedId: number | null = null;
  currentLatitude: number | null = null;
  currentLongitude: number | null = null;
  private locationSubscription!: Subscription;
  private currentUser!: User;
  private hasFetchedPlaces = false;

  constructor(
    private mapService: MapService,
    private locationService: LocationService,
    private placesService: PlacesService,
    private routeService: RouteService,
    private router: Router,
    private userFavouriteService: UserFavouriteService,
    private authService: AuthService,
    private userService: UserService,
    private userStoryService: UserStoryService
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
          this.fetchAndLoadPlaces();
        } else {
          this.hasLocation = false;
          this.error =
            'No saved location found. Please update your location in your profile.';
        }
      },
      error: (err) => {
        this.error = 'Failed to load user data.';
        this.hasLocation = false;
      },
    });
    this.loadSavedVisited();
    this.loadVisitedSites();
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
    // Use a bounding box of ±0.02 degrees for a more focused area
    const south = this.currentLatitude - 0.02;
    const north = this.currentLatitude + 0.02;
    const west = this.currentLongitude - 0.02;
    const east = this.currentLongitude + 0.02;
    this.loading = true;
    this.placesService.fetchPlacesForArea(south, west, north, east).subscribe({
      next: () => {
        // After fetch, load places from backend
        this.placesService.getAllPlaces().subscribe({
          next: (places) => {
            // Remove duplicates by id
            const uniquePlaces = new Map<number, Place>();
            for (const place of places) {
              if (!uniquePlaces.has(place.id)) {
                uniquePlaces.set(place.id, place);
              }
            }
            this.places = Array.from(uniquePlaces.values());
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load places from backend.';
            this.loading = false;
          },
        });
      },
      error: (err) => {
        // Even if fetch fails, try to load places from backend
        this.placesService.getAllPlaces().subscribe({
          next: (places) => {
            const uniquePlaces = new Map<number, Place>();
            for (const place of places) {
              if (!uniquePlaces.has(place.id)) {
                uniquePlaces.set(place.id, place);
              }
            }
            this.places = Array.from(uniquePlaces.values());
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load places from backend.';
            this.loading = false;
          },
        });
      },
    });
  }

  updateLocation(): void {
    // Only use geolocation when user clicks update
    this.loading = true;
    this.locationService.requestAndSaveLocation().subscribe({
      next: (location) => {
        this.userService.updateCurrentUserLocation(location).subscribe(() => {
          this.currentLatitude = location.latitude;
          this.currentLongitude = location.longitude;
          this.hasLocation = true;
          this.fetchAndLoadPlaces();
          this.loading = false;
        });
      },
      error: (err: any) => {
        this.error = err.message;
        this.loading = false;
      },
    });
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
            console.error('Error searching places:', error);
          },
          complete: () => {
            this.loading = false;
          },
        });
    } catch (error) {
      this.error = 'Failed to load places. Please try again.';
      console.error('Error searching places:', error);
    }
  }

  async selectPlace(place: Place): Promise<void> {
    if (this.currentLatitude == null || this.currentLongitude == null) {
      this.error = 'Your location is not available. Cannot calculate route.';
      return;
    }

    this.selectedPlace = place;
    try {
      const creds = this.authService.getCredentials();
      this.routeService
        .getRoute(
          [this.currentLatitude, this.currentLongitude],
          [place.latitude, place.longitude],
          this.transportMode,
          creds?.email,
          creds?.password
        )
        .subscribe({
          next: (routeInfo) => {
            this.routeInfo = routeInfo;
            if (routeInfo.geometry) {
              this.mapService.displayRoute(routeInfo.geometry);
            }
          },
          error: (error) => {
            console.error('Error getting route:', error);
            this.error = 'Failed to get route. Please try again.';
          },
        });
    } catch (error) {
      console.error('Error getting current location:', error);
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
          if (routeInfo.geometry) {
            this.mapService.displayRoute(routeInfo.geometry);
          }
        },
        error: (error) => {
          console.error('Error getting route:', error);
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
    if (this.hasLocation) {
      this.searchNearbyPlaces();
    }
  }

  onRadiusChange(): void {
    if (this.hasLocation) {
      this.searchNearbyPlaces();
    }
  }

  loadSavedVisited(): void {
    this.savedIds.clear();
    this.visitedIds.clear();
    const user = this.authService.getCurrentUser();
    const creds = this.authService.getCredentials();
    if (!user || !creds) return;
    this.userFavouriteService
      .getFavouritesByUser(user.id, creds.email, creds.password)
      .subscribe({
        next: (favs) => {
          favs.forEach((fav) => this.savedIds.add(fav.siteId));
        },
        error: (err) => {
          console.error('Failed to load favourites from database', err);
        },
      });
  }

  saveToFavorites(place: Place): void {
    if (this.savingFavouriteId === place.id || this.isPlaceSaved(place)) return;
    const user = this.authService.getCurrentUser();
    const creds = this.authService.getCredentials();
    if (!user || !creds) return;
    this.savingFavouriteId = place.id;
    const payload = {
      userId: user.id,
      siteId: place.id,
      siteType: place.type,
    };
    this.userFavouriteService
      .createFavourite(payload, creds.email, creds.password)
      .subscribe({
        next: () => {
          this.loadSavedVisited();
        },
        error: (err) => {
          console.error('Failed to save favourite', err);
        },
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
    this.userStoryService.getVisitedSites().subscribe({
      next: (stories) => {
        this.visitedStories = stories;
        stories.forEach((story) => {
          if (story.placeId) this.visitedIds.add(story.placeId);
        });
      },
      error: (err) => {
        console.error('Failed to load visited sites', err);
      },
    });
  }

  markAsVisited(place: Place): void {
    if (this.savingVisitedId === place.id || this.isPlaceVisited(place)) return;
    this.savingVisitedId = place.id;
    this.userStoryService.markSiteAsVisited(place.id.toString()).subscribe({
      next: (story) => {
        if (story.placeId) this.visitedIds.add(story.placeId);
        this.loadVisitedSites();
      },
      error: (err) => {
        console.error('Failed to mark as visited', err);
      },
      complete: () => {
        this.savingVisitedId = null;
      },
    });
  }

  isPlaceVisited(place: Place): boolean {
    return this.visitedIds.has(place.id.toString());
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocationButtonComponent } from '../../components/location-button/location-button.component';
import { DistancePipe } from '../../pipes/distance.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { MapService } from '../../services/map.service';
import { LocationService } from '../../services/location.service';
import { PlacesService } from '../../services/places.service';
import { RouteService } from '../../services/route.service';
import { Place } from '../../models/place.model';
import { RouteInfo } from '../../models/route.model';
import { UserFavouriteService } from '../../services/user-favourite.service';
import { AuthService } from '../../services/auth.service';
import { MapComponent } from '../../shared/components/map/map.component';

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
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  places: Place[] = [];
  selectedPlace: Place | null = null;
  selectedType: string = '';
  searchRadius: number = 1000;
  loading: boolean = false;
  error: string | null = null;
  hasLocation: boolean = false;
  routeInfo: RouteInfo | null = null;
  transportMode: TransportMode = 'driving-car';
  private subscriptions: Subscription[] = [];
  private pendingMapInit = false;
  savedIds: Set<number> = new Set();
  visitedIds: Set<number> = new Set();
  savingFavouriteId: number | null = null;
  savingVisitedId: number | null = null;
  currentLatitude: number = 0;
  currentLongitude: number = 0;

  constructor(
    private mapService: MapService,
    private locationService: LocationService,
    private placesService: PlacesService,
    private routeService: RouteService,
    private router: Router,
    private userFavouriteService: UserFavouriteService,
    private authService: AuthService
  ) {
    this.locationService.hasLocation$.subscribe((hasLocation) => {
      this.hasLocation = hasLocation;
      if (hasLocation) {
        this.locationService.getCurrentLocation().then(([lat, lng]) => {
          this.currentLatitude = lat;
          this.currentLongitude = lng;
          this.searchNearbyPlaces([lat, lng]);
        });
      } else {
        this.mapService.destroyMap();
      }
    });
  }

  ngOnInit(): void {
    this.loadSavedVisited();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.mapService.destroyMap();
  }

  async searchNearbyPlaces(coordinates: [number, number]): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const [lat, lng] = coordinates;
      this.mapService
        .searchPlaces(lat, lng, this.searchRadius, this.selectedType)
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
    // Check for valid coordinates FIRST
    if (
      place.latitude == null ||
      place.longitude == null ||
      isNaN(place.latitude) ||
      isNaN(place.longitude)
    ) {
      this.error = 'Selected place has invalid coordinates.';
      return;
    }
    this.selectedPlace = place;
    try {
      const currentLocation = await this.locationService.getCurrentLocation();
      const creds = this.authService.getCredentials();
      this.routeService
        .getRoute(
          currentLocation,
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

    try {
      const currentLocation = await this.locationService.getCurrentLocation();
      const subscription = this.routeService
        .getRoute(
          currentLocation,
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
    } catch (error) {
      console.error('Error getting current location:', error);
      this.error = 'Failed to get current location. Please try again.';
      this.loading = false;
    }
  }

  async goToCurrentLocation(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const coordinates = await this.locationService.getCurrentLocation();
      this.hasLocation = true;
      await this.searchNearbyPlaces(coordinates);
    } catch (error) {
      console.error('Error getting current location:', error);
      this.error = 'Failed to get current location. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  clearRoute(): void {
    this.routeInfo = null;
    this.mapService.clearRoute();
  }

  onTypeChange(): void {
    if (this.hasLocation) {
      this.locationService.getCurrentLocation().then((coordinates) => {
        this.searchNearbyPlaces(coordinates);
      });
    }
  }

  onRadiusChange(): void {
    if (this.hasLocation) {
      this.locationService.getCurrentLocation().then((coordinates) => {
        this.searchNearbyPlaces(coordinates);
      });
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

  isPlaceVisited(place: Place): boolean {
    return this.visitedIds.has(place.id);
  }
}

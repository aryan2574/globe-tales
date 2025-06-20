import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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
  ],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
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
        setTimeout(() => {
          this.initializeMap();
        });
      } else {
        this.mapService.destroyMap();
      }
    });
  }

  ngOnInit(): void {
    this.loadSavedVisited();
  }

  ngAfterViewInit(): void {
    if (this.hasLocation) {
      setTimeout(() => {
        this.initializeMap();
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.mapService.destroyMap();
  }

  private async initializeMap(): Promise<void> {
    try {
      let coordinates: [number, number] | undefined = undefined;
      if (this.hasLocation) {
        try {
          coordinates = await this.locationService.getCurrentLocation();
        } catch {}
      }
      this.mapService.initializeMap('map', coordinates);
      if (coordinates) {
        this.mapService.showUserLocationMarker(coordinates);
        await this.searchNearbyPlaces(coordinates);
      }
    } catch (error) {
      this.error = 'Failed to initialize map. Please refresh the page.';
      console.error('Map initialization error:', error);
    }
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
            this.mapService.displayPlaces(this.places);
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

  selectPlace(place: Place): void {
    this.selectedPlace = place;
    this.mapService.flyTo([place.latitude, place.longitude]);
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
      this.mapService.flyTo(coordinates);
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
          this.savedIds.add(place.id);
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

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

  constructor(
    private mapService: MapService,
    private locationService: LocationService,
    private placesService: PlacesService,
    private routeService: RouteService,
    private router: Router
  ) {
    this.locationService.hasLocation$.subscribe((hasLocation) => {
      this.hasLocation = hasLocation;
    });
  }

  ngOnInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.mapService.destroyMap();
  }

  private initializeMap(): void {
    try {
      this.mapService.initializeMap('map');
    } catch (error) {
      this.error = 'Failed to initialize map. Please refresh the page.';
      console.error('Map initialization error:', error);
    }
  }

  async searchNearbyPlaces(coordinates: [number, number]): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      this.places = await this.placesService.searchNearbyPlaces(
        coordinates,
        this.searchRadius,
        this.selectedType
      );
      this.mapService.displayPlaces(this.places);
    } catch (error) {
      this.error = 'Failed to load places. Please try again.';
      console.error('Error searching places:', error);
    } finally {
      this.loading = false;
    }
  }

  selectPlace(place: Place): void {
    this.selectedPlace = place;
    this.mapService.flyTo(place.coordinates);
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
          this.selectedPlace.coordinates,
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
}

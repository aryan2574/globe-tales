import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../../services/map.service';
import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container" style="position:relative;">
      <div #mapContainer class="map-inner"></div>
      <button
        class="current-location-btn"
        (click)="goToCurrentLocation()"
        title="Go to current location"
        type="button"
      >
        <i class="fas fa-crosshairs"></i>
      </button>
    </div>
  `,
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() latitude!: number;
  @Input() longitude!: number;
  @Input() zoom: number = 14;
  @Input() places: Place[] = [];
  @Input() selectedPlace: Place | null = null;
  @Input() favourites: Place[] = [];

  @Input() set routeGeometry(geometry: any) {
    if (geometry) {
      this.mapService.displayRoute(geometry);
    } else {
      this.mapService.clearRoute();
    }
  }

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  private mapId: string = '';
  private lastCenter: [number, number] | null = null;

  constructor(private mapService: MapService) {}

  ngAfterViewInit(): void {
    this.mapId = 'map-' + Math.random().toString(36).substring(2, 10);
    this.mapContainer.nativeElement.id = this.mapId;

    // Attempt to initialize the map
    this.mapService.initializeMap(this.mapId, [this.latitude, this.longitude]);
    this.lastCenter = [this.latitude, this.longitude];
    this.updateMap();

    // Aggressively check and invalidate size until the map is properly rendered
    const map = this.mapService.getMap();
    if (map) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            map.invalidateSize();
            resizeObserver.disconnect(); // Stop observing once the map is sized
          }
        }
      });
      resizeObserver.observe(this.mapContainer.nativeElement);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const map = this.mapService.getMap();
    if (this.mapId && map) {
      // If coordinates change, update the center
      if (changes['latitude'] || changes['longitude']) {
        this.lastCenter = [this.latitude, this.longitude];
      }
      this.updateMap();
      // Update favourites if they change
      if (changes['favourites']) {
        this.mapService.displayFavourites(this.favourites);
      }
    }
  }

  ngOnDestroy(): void {
    this.mapService.destroyMap();
  }

  goToCurrentLocation() {
    if (this.lastCenter) {
      this.mapService.flyTo(this.lastCenter);
    }
  }

  private updateMap() {
    if (this.lastCenter) {
      this.mapService.flyTo(this.lastCenter);
      this.mapService.showUserLocationMarker(this.lastCenter);
    }
    if (this.places && this.places.length > 0) {
      this.mapService.displayPlaces(this.places);
    }
    if (this.favourites && this.favourites.length > 0) {
      this.mapService.displayFavourites(this.favourites);
    }
  }
}

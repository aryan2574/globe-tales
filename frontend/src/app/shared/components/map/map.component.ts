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
  @Input() routeGeometry: any = null;
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  private mapId: string = '';
  private lastCenter: [number, number] | null = null;

  constructor(private mapService: MapService) {}

  ngAfterViewInit(): void {
    this.mapId = 'map-' + Math.random().toString(36).substring(2, 10);
    this.mapContainer.nativeElement.id = this.mapId;
    this.mapService.initializeMap(this.mapId, [this.latitude, this.longitude]);
    this.lastCenter = [this.latitude, this.longitude];
    this.updateMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const map = this.mapService.getMap();
    if (this.mapId && map) {
      if (changes['latitude'] || changes['longitude']) {
        this.lastCenter = [this.latitude, this.longitude];
      }
      this.updateMap();
      setTimeout(() => {
        map.invalidateSize();
      }, 0);
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
    if (this.routeGeometry) {
      this.mapService.displayRoute(this.routeGeometry);
    } else {
      this.mapService.clearRoute();
    }
  }
}

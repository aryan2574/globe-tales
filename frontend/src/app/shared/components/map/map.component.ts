import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../../services/map.service';

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
export class MapComponent implements AfterViewInit, OnDestroy {
  @Input() latitude!: number;
  @Input() longitude!: number;
  @Input() zoom: number = 14;
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  private mapId: string = '';

  constructor(private mapService: MapService) {}

  ngAfterViewInit(): void {
    this.mapId = 'map-' + Math.random().toString(36).substring(2, 10);
    this.mapContainer.nativeElement.id = this.mapId;
    this.mapService.initializeMap(this.mapId, [this.latitude, this.longitude]);
    this.mapService.showUserLocationMarker([this.latitude, this.longitude]);
  }

  ngOnDestroy(): void {
    this.mapService.destroyMap();
  }

  goToCurrentLocation() {
    this.mapService.flyTo([this.latitude, this.longitude]);
  }
}

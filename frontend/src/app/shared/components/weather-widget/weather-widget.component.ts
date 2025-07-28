import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WeatherService } from '../../../services/weather.service';
import { LocationService } from '../../../services/location.service';
import { WeatherResponse } from '../../../models/weather.model';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.scss'],
})
export class WeatherWidgetComponent implements OnInit, OnDestroy {
  @Input() latitude?: number | null;
  @Input() longitude?: number | null;

  weather: WeatherResponse | null = null;
  weatherDescription = '';
  weatherIconClass = 'fas fa-question-circle';
  private locationSubscription!: Subscription;

  private static WMO_CODES: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  private static ICON_MAP: { [key: number]: string } = {
    0: 'fa-sun',
    1: 'fa-sun',
    2: 'fa-cloud-sun',
    3: 'fa-cloud',
    45: 'fa-smog',
    48: 'fa-smog',
    51: 'fa-cloud-rain',
    53: 'fa-cloud-rain',
    55: 'fa-cloud-showers-heavy',
    56: 'fa-cloud-rain',
    57: 'fa-cloud-showers-heavy',
    61: 'fa-cloud-rain',
    63: 'fa-cloud-showers-heavy',
    65: 'fa-pour-rain',
    66: 'fa-cloud-sleet',
    67: 'fa-cloud-sleet',
    71: 'fa-snowflake',
    73: 'fa-snowflake',
    75: 'fa-snowflake-heavy',
    77: 'fa-snow-grains',
    80: 'fa-cloud-rain',
    81: 'fa-cloud-showers-heavy',
    82: 'fa-cloud-pour',
    85: 'fa-cloud-snow',
    86: 'fa-cloud-snow',
    95: 'fa-bolt',
    96: 'fa-bolt',
    99: 'fa-bolt',
  };

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    if (this.latitude && this.longitude) {
      this.fetchWeather(this.latitude, this.longitude);
    }

    this.locationSubscription = this.locationService.location$.subscribe(
      (location) => {
        if (location) {
          this.fetchWeather(location.latitude, location.longitude);
        }
      }
    );
  }

  private fetchWeather(lat: number, lon: number): void {
    this.weatherService.getWeather(lat, lon).subscribe((weatherData) => {
      this.weather = weatherData;
      this.weatherDescription =
        WeatherWidgetComponent.WMO_CODES[weatherData.current.weather_code] ||
        'Unknown';
      this.weatherIconClass = `fas ${
        WeatherWidgetComponent.ICON_MAP[weatherData.current.weather_code] ||
        'fa-question-circle'
      }`;
    });
  }

  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }
}

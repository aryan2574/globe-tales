import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = '/api/weather';

  constructor(private http: HttpClient) {}

  getWeather(lat: number, lon: number): Observable<WeatherResponse> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString());
    return this.http.get<WeatherResponse>(this.apiUrl, { params });
  }
}

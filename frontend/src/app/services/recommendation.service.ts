import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recommendation } from '../models/recommendation.model';
import { RecommendationResponse } from '../models/recommendation-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private apiUrl = `${environment.apiUrl}/recommendations`;

  constructor(private http: HttpClient) {}

  getRecommendations(
    transportMode: string,
    maxDistance: number,
    page: number
  ): Observable<RecommendationResponse> {
    let params = new HttpParams()
      .set('transportMode', transportMode)
      .set('maxDistance', maxDistance.toString())
      .set('page', page.toString());

    return this.http.get<RecommendationResponse>(this.apiUrl, { params });
  }
}

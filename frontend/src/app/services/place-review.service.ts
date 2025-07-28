import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlaceReview } from '../models/place-review.model';

@Injectable({
  providedIn: 'root',
})
export class PlaceReviewService {
  private apiUrl = '/api/reviews';

  constructor(private http: HttpClient) {}

  createReview(review: Partial<PlaceReview>): Observable<PlaceReview> {
    return this.http.post<PlaceReview>(this.apiUrl, review);
  }

  getReviewsByPlaceId(placeId: string): Observable<PlaceReview[]> {
    return this.http.get<PlaceReview[]>(`${this.apiUrl}/place/${placeId}`);
  }

  getReviewsByUserId(userId: string): Observable<PlaceReview[]> {
    return this.http.get<PlaceReview[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateReview(
    id: string,
    review: Partial<PlaceReview>
  ): Observable<PlaceReview> {
    return this.http.put<PlaceReview>(`${this.apiUrl}/${id}`, review);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

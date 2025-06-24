export interface PlaceReview {
  id: string;
  userId: string;
  username: string;
  placeId: string;
  placeName: string;
  comment: string;
  rating: number;
  createdAt: Date;
}

export interface UserStory {
  id?: string;
  userId: string;
  placeId?: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  visitDate?: Date;
  rating?: number;
}

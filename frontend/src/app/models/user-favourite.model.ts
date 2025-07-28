import { User } from './user.model';

export interface UserFavourite {
  userId: string;
  siteId: number;
  siteType?: string;
  savedAt?: Date;
  placeName?: string;
}

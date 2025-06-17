import { CulturalSite } from './cultural-site.model';
import { User } from './user.model';

export interface UserFavourite {
  id: number;
  userId: string;
  siteId: number;
  site: CulturalSite;
  createdAt: Date;
}

import { CulturalSite } from './cultural-site.model';

export interface UserPlace {
  id: number;
  userId: string;
  siteId: number;
  site: CulturalSite;
  visitStatus: string;
  visitedAt: Date;
  notes?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

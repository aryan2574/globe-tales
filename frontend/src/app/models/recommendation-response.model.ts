import { Recommendation } from './recommendation.model';

export interface RecommendationResponse {
  recommendations: Recommendation[];
  hasMore: boolean;
}

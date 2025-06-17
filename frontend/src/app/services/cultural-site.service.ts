import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CulturalSite } from '../models/cultural-site.model';

@Injectable({
  providedIn: 'root',
})
export class CulturalSiteService {
  constructor(private apiService: ApiService) {}

  getAllSites(): Observable<CulturalSite[]> {
    return this.apiService.get<CulturalSite[]>('/sites');
  }

  getSiteById(id: number): Observable<CulturalSite> {
    return this.apiService.get<CulturalSite>(`/sites/${id}`);
  }

  createSite(site: CulturalSite): Observable<CulturalSite> {
    return this.apiService.post<CulturalSite>('/sites', site);
  }

  updateSite(id: number, site: CulturalSite): Observable<CulturalSite> {
    return this.apiService.put<CulturalSite>(`/sites/${id}`, site);
  }

  deleteSite(id: number): Observable<void> {
    return this.apiService.delete(`/sites/${id}`);
  }

  getSitesByType(siteType: string): Observable<CulturalSite[]> {
    return this.apiService.get<CulturalSite[]>(`/sites/type/${siteType}`);
  }

  getNearbySites(
    latitude: number,
    longitude: number,
    radius: number
  ): Observable<CulturalSite[]> {
    return this.apiService.get<CulturalSite[]>(
      `/sites/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    );
  }

  getNearbySitesByType(
    latitude: number,
    longitude: number,
    radius: number,
    siteType: string
  ): Observable<CulturalSite[]> {
    return this.apiService.get<CulturalSite[]>(
      `/sites/nearby/type?latitude=${latitude}&longitude=${longitude}&radius=${radius}&siteType=${siteType}`
    );
  }

  searchSites(query: string): Observable<CulturalSite[]> {
    return this.apiService.get<CulturalSite[]>(`/sites/search?query=${query}`);
  }
}

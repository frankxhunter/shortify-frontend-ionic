import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  CreateUrlRequest,
  UrlItem,
  UrlRequest,
} from '../../Dtos/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllUrls(): Observable<UrlItem[]> {
    return this.http.get<UrlItem[]>(`${this.baseUrl}/urls`);
  }

  getUrlById(id: number): Observable<UrlItem> {
    return this.http.get<UrlItem>(`${this.baseUrl}/urls/${id}`);
  }

  createUrl(body: CreateUrlRequest): Observable<UrlItem> {
    return this.http.post<UrlItem>(`${this.baseUrl}/urls/create`, body).pipe(
      map((response) => ({
        ...response,
        shortUrl: `${environment.apiUrl}/${response.shortUrl}`
      }))
    );
  }

  getUrlRequests(id: number): Observable<UrlRequest[]> {
    return this.http.get<UrlRequest[]>(
      `${this.baseUrl}/urls/${id}/requests`
    );
  }
}
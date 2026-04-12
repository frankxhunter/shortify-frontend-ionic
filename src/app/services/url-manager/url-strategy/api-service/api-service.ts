import { Injectable, OnInit, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import {
  CreateUrlRequest,
  UrlItem,
} from '../../../../Dtos/interfaces';
import { environment } from 'src/environments/environment';
import { UrlInterface } from '../url-strategy';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements UrlInterface {

  private readonly baseUrl = environment.apiUrl;

  private _urls = signal<UrlItem[]>([]);
  readonly urls = this._urls.asReadonly();

  constructor(private http: HttpClient) { }

  loadAll(): Observable<UrlItem[]> {
    return this.http.get<UrlItem[]>(`${this.baseUrl}/urls`).pipe(
      map(urls => urls.map(u => this.addPrefixToUrl(u))),
      tap(urls => this._urls.set(urls))
    );
  }

  add(url: CreateUrlRequest): Observable<UrlItem> {
    return this.createUrl(url);
  }

  remove(id: number): void {
    this._urls.update(list => list.filter(u => u.id !== id));
  }

  createUrl(body: CreateUrlRequest): Observable<UrlItem> {
    return this.http.post<UrlItem>(`${this.baseUrl}/urls/create`, body).pipe(
      map(r => this.addPrefixToUrl(r)),
      tap(url => this._urls.update(list => [...list, url]))
    );
  }

  private addPrefixToUrl(url: UrlItem): UrlItem {
    return {
      ...url,
      shortUrl: `${environment.apiUrl}/${url.shortUrl}`
    };
  }
}
import { Injectable, signal, computed, inject, Signal } from '@angular/core';
import { CreateUrlRequest, UrlItem } from 'src/app/Dtos/interfaces';
import { Storage } from '@ionic/storage-angular';
import { UrlInterface } from '../url-strategy';
import { ApiService } from '../api-service/api-service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UrlStorageService implements UrlInterface {

  private STORAGE_KEY = 'urls';
  private _urls = signal<UrlItem[]>([]);
  readonly urls = this._urls.asReadonly();

  apiService = inject(ApiService)

  constructor(private storage: Storage) {
    this.init();
  }
  async init() {
    await this.storage.create();
    const data = await this.storage.get(this.STORAGE_KEY);
    this._urls.set(data || []);
  }

  add(url: CreateUrlRequest): Observable<UrlItem> {
    return this.apiService.createUrl(url).pipe(
      tap((urlItem) => this.addToPersistence(urlItem))
    )
  }

  remove(id: number) {
    const updated = this._urls().filter(url => url.id !== id);
    this.persist(updated);
  }

  private async persist(urls: UrlItem[]) {
    this._urls.set(urls);
    await this.storage.set(this.STORAGE_KEY, urls);
  }

  private addToPersistence(urlItem: UrlItem) {
    if (!this._urls().find((url) => url.id === urlItem.id)) {
      const updated = [...this._urls(), urlItem]
        .sort((a, b) => b.creationDate.localeCompare(a.creationDate));
      this.persist(updated);
    }
  }
}
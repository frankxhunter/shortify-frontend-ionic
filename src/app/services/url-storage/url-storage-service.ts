import { Injectable, signal, computed } from '@angular/core';
import { UrlItem } from 'src/app/Dtos/interfaces';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class UrlStorageService {

  private STORAGE_KEY = 'urls';
  private _urls = signal<UrlItem[]>([]);

  // Públicos (solo lectura)
  readonly urls = this._urls.asReadonly();
  readonly count = computed(() => this._urls().length);

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const data = await this.storage.get(this.STORAGE_KEY);
    this._urls.set(data || []);
  }

  async addUrl(url: UrlItem) {
    const updated = [...this._urls(), url]
      .sort((a, b) => b.creationDate.localeCompare(a.creationDate));
    await this.persist(updated);
  }

  async removeUrl(id: number) {
    const updated = this._urls().filter(url => url.id !== id);
    await this.persist(updated);
  }

  async clearAll() {
    await this.persist([]);
  }

  private async persist(urls: UrlItem[]) {
    this._urls.set(urls);
    await this.storage.set(this.STORAGE_KEY, urls);
  }
}
import { computed, effect, inject, Injectable, OnInit, signal } from '@angular/core';
import { AuthService } from '../auth-service/auth-service';
import { UrlInterface } from './url-strategy/url-strategy';
import { ApiService } from './url-strategy/api-service/api-service';
import { UrlStorageService } from './url-strategy/url-storage/url-storage-service';
import { CreateUrlRequest } from 'src/app/Dtos/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UrlManager {
  authService = inject(AuthService)
  private apiService = inject(ApiService);
  private storageService = inject(UrlStorageService);

  authUser = this.authService.userAuth
  urls = computed(() => this.service.urls())

  constructor() {
    effect(() => {
      if (this.authUser()) {
        this.apiService.loadAll().subscribe({
          next: () => { }
        });
      }
    });
  }

  private get service() {
    return this.authUser() ? this.apiService : this.storageService
  }

  add(url: CreateUrlRequest) {
    return this.service.add(url)
  }

  remove(id: number) {
    this.service.remove(id);
  }



}

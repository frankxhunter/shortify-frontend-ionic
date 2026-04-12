import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUrlRequest, UrlItem } from 'src/app/Dtos/interfaces';

export interface UrlInterface {
  readonly urls: Signal<UrlItem[]>;
  add(url: CreateUrlRequest): Observable<UrlItem>;
  remove(id: number): void;
}
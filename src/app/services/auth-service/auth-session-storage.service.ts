import { Injectable, signal } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StoredAuthSession } from 'src/app/Dtos/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionStorageService {
  private readonly storageKey = 'auth_session';
  private readonly initialized = signal(false);
  private readonly _session = signal<StoredAuthSession | null>(null);

  readonly session = this._session.asReadonly();

  constructor(private storage: Storage) {}

  async init(): Promise<void> {
    if (this.initialized()) {
      return;
    }

    await this.storage.create();
    const session = await this.storage.get(this.storageKey);
    this._session.set(session ?? null);
    this.initialized.set(true);
  }

  async setSession(session: StoredAuthSession): Promise<void> {
    await this.init();
    this._session.set(session);
    await this.storage.set(this.storageKey, session);
  }

  async clear(): Promise<void> {
    await this.init();
    this._session.set(null);
    await this.storage.remove(this.storageKey);
  }
}

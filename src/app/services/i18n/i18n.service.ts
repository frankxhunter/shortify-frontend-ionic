import { Injectable, computed, signal } from '@angular/core';
import { en } from 'src/app/i18n/translations/en';
import { es } from 'src/app/i18n/translations/es';

export type AppLanguage = 'es' | 'en';

interface TranslationTree {
  [key: string]: string | TranslationTree;
}

const STORAGE_KEY = 'shortfy.language';
const TRANSLATIONS: Record<AppLanguage, TranslationTree> = { en, es };

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private readonly languageSignal = signal<AppLanguage>(this.detectInitialLanguage());

  readonly language = computed(() => this.languageSignal());

  constructor() {
    this.applyLanguage(this.languageSignal());
  }

  setLanguage(language: AppLanguage) {
    this.languageSignal.set(language);
    this.applyLanguage(language);
  }

  translate(key: string, params?: Record<string, string | number>): string {
    const value = this.getValueFromKey(TRANSLATIONS[this.languageSignal()], key);

    if (typeof value !== 'string') {
      return key;
    }

    return this.interpolate(value, params);
  }

  private detectInitialLanguage(): AppLanguage {
    if (typeof window !== 'undefined') {
      const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
      if (storedLanguage === 'es' || storedLanguage === 'en') {
        return storedLanguage;
      }
    }

    if (typeof navigator !== 'undefined') {
      const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
      const hasSpanish = browserLanguages.some((language) => language.toLowerCase().startsWith('es'));
      return hasSpanish ? 'es' : 'en';
    }

    return 'en';
  }

  private applyLanguage(language: AppLanguage) {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.title = this.translate('app.pageTitle');
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
  }

  private getValueFromKey(source: TranslationTree, key: string): string | TranslationTree | undefined {
    return key.split('.').reduce<string | TranslationTree | undefined>((currentValue, currentKey) => {
      if (!currentValue || typeof currentValue === 'string') {
        return undefined;
      }

      return currentValue[currentKey];
    }, source);
  }

  private interpolate(template: string, params?: Record<string, string | number>): string {
    if (!params) {
      return template;
    }

    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(params[key] ?? ''));
  }
}

import { Injectable, signal, computed } from '@angular/core';
import { uk } from '../translations/uk';
import { en } from '../translations/en';

export type Language = 'uk' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'todo_app_lang';
  
  currentLang = signal<Language>(this.getInitialLanguage());

  translations = computed(() => {
    return this.currentLang() === 'uk' ? uk : en;
  });

  setLanguage(lang: Language): void {
    localStorage.setItem(this.STORAGE_KEY, lang);
    this.currentLang.set(lang);
    // Update html lang attribute for accessibility and SEO
    document.documentElement.lang = lang;
  }

  // Translates a dotted path key, e.g. 'auth.login.title'
  translate(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let current: any = this.translations();
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return key; // Fallback to key if not found
      }
    }

    if (typeof current !== 'string') {
      return key;
    }

    let text = current;
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(val));
      });
    }
    return text;
  }

  private getInitialLanguage(): Language {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'uk' || saved === 'en') {
      document.documentElement.lang = saved;
      return saved;
    }
    
    // Auto-detect browser language
    const browserLang = navigator.language || '';
    const isUk = browserLang.toLowerCase().includes('uk') || browserLang.toLowerCase().includes('ua');
    const initial = isUk ? 'uk' : 'en';
    
    document.documentElement.lang = initial;
    return initial;
  }
}

import { Injectable, signal } from '@angular/core';

export type Language = 'uk' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'todo_app_lang';
  
  currentLang = signal<Language>('en');
  translations = signal<any>({});

  async initLanguage(): Promise<void> {
    const initialLang = this.getInitialLanguage();
    await this.loadTranslations(initialLang);
    this.currentLang.set(initialLang);
    document.documentElement.lang = initialLang;
  }

  async setLanguage(lang: Language): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, lang);
    await this.loadTranslations(lang);
    this.currentLang.set(lang);
    document.documentElement.lang = lang;
  }

  private async loadTranslations(lang: Language): Promise<void> {
    try {
      if (lang === 'uk') {
        const module = await import('../translations/uk');
        this.translations.set(module.uk);
      } else {
        const module = await import('../translations/en');
        this.translations.set(module.en);
      }
    } catch (err) {
      console.error(`Failed to load translations for ${lang}`, err);
    }
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
      return saved;
    }
    
    // Auto-detect browser language
    const browserLang = navigator.language || '';
    const isUk = browserLang.toLowerCase().includes('uk') || browserLang.toLowerCase().includes('ua');
    return isUk ? 'uk' : 'en';
  }
}

import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  private lastKey: string = '';
  private lastLang: string = '';
  private lastParams: string = '';
  private lastResult: string = '';

  transform(key: string, params?: Record<string, string | number>): string {
    const currentLang = this.translationService.currentLang();
    const paramsStr = params ? JSON.stringify(params) : '';

    if (key === this.lastKey && currentLang === this.lastLang && paramsStr === this.lastParams) {
      return this.lastResult;
    }

    this.lastKey = key;
    this.lastLang = currentLang;
    this.lastParams = paramsStr;
    this.lastResult = this.translationService.translate(key, params);

    return this.lastResult;
  }
}

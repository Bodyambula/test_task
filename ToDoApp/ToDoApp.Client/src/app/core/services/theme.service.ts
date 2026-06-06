import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'todo_app_theme';
  
  currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Apply theme on instantiation
    this.applyTheme(this.currentTheme());
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.currentTheme.set(theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const nextTheme: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;

    // Enable smooth transition only during theme switch
    root.classList.add('theme-transition');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Remove the transition class after animation completes to avoid
    // performance overhead on normal interactions
    setTimeout(() => root.classList.remove('theme-transition'), 350);
  }

  private getInitialTheme(): Theme {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    
    // Fallback to media query
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}

import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginModel, RegisterModel } from '../models/todo.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8081/api/auth';

  // Signals for auth state
  private currentUserSignal = signal<AuthResponse | null>(null);

  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => this.currentUserSignal() !== null);
  token = computed(() => this.currentUserSignal()?.token || null);

  constructor() {
    this.loadSession();
  }

  register(model: RegisterModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, model);
  }

  login(model: LoginModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, model).pipe(
      tap(response => this.setSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem('todo_auth_session');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem('todo_auth_session', JSON.stringify(authResponse));
    this.currentUserSignal.set(authResponse);
  }

  private loadSession(): void {
    const sessionStr = localStorage.getItem('todo_auth_session');
    if (sessionStr) {
      try {
        const session: AuthResponse = JSON.parse(sessionStr);
        if (session && session.token) {
          this.currentUserSignal.set(session);
        }
      } catch (e) {
        localStorage.removeItem('todo_auth_session');
      }
    }
  }
}

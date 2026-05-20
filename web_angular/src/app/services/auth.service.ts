import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'auth_role';

  constructor(private http: HttpClient, private router: Router) {}

  /** Envoyer les credentials au backend et stocker le JWT */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.ROLE_KEY, response.role);
      })
    );
  }

  /** Inscrire un nouvel utilisateur et stocker le JWT */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.ROLE_KEY, response.role);
      })
    );
  }

  /** Supprimer le token et rediriger vers login */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.router.navigate(['/login']);
  }

  /** Récupérer le token JWT stocké */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Récupérer le rôle de l'utilisateur connecté */
  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  /** Vérifier si l'utilisateur est connecté */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Vérifier si l'utilisateur est admin */
  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  /** Vérifier si l'utilisateur est étudiant */
  isStudent(): boolean {
    return this.getRole() === 'STUDENT';
  }
}

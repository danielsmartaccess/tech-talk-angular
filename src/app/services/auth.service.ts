import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  
  // MÉTODO TEMPORÁRIO APENAS PARA TESTE - Simula um usuário logado
  mockLogin(): void {
    const mockUser: User = {
      id: 1,
      username: 'usuario_teste',
      email: 'teste@gotechtalkt.com.br',
      role: 'user'
    };
    
    localStorage.setItem('currentUser', JSON.stringify({
      user: mockUser,
      token: 'mock-jwt-token'
    }));
    
    this.currentUserSubject.next(mockUser);
  }
  
  // MÉTODO TEMPORÁRIO APENAS PARA TESTE - Simula um admin logado
  mockLoginAsAdmin(): void {
    const mockAdmin: User = {
      id: 2,
      username: 'admin_teste',
      email: 'admin@gotechtalkt.com.br',
      role: 'admin'
    };
    
    localStorage.setItem('currentUser', JSON.stringify({
      user: mockAdmin,
      token: 'mock-admin-jwt-token'
    }));
    
    this.currentUserSubject.next(mockAdmin);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    if (email === 'admin@techtalk.com' && password === 'admin123') {
      const mockResponse: AuthResponse = {
        user: {
          id: 1,
          username: 'Admin',
          email: 'admin@techtalk.com',
          role: 'admin'
        },
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2)
      };
      
      this.storeUserData(mockResponse);
      this.currentUserSubject.next(mockResponse.user);
      return of(mockResponse);
    }
    
    return throwError(() => new Error('Credenciais inválidas. Tente novamente.'));
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  private storeUserData(response: AuthResponse) {
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
  }

  private getUserFromLocalStorage(): User | null {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  }
}
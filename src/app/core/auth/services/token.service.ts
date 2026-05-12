import { Injectable } from '@angular/core';

export interface TokenPayload {
  userId: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.getPayload();
    if (!payload) return false;

    return payload.exp * 1000 > Date.now();
  }

  getPayload(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Payload = token.split('.')[1];
      const decoded = atob(base64Payload);
      return JSON.parse(decoded) as TokenPayload;
    } catch {
      return null;
    }
  }
}

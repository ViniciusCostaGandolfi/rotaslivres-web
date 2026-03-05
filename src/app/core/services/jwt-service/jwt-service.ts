import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private readonly platformId = inject(PLATFORM_ID);

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(environment.GRADEHORARIOS_TOKEN, token);
    }
  }

  deleteToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(environment.GRADEHORARIOS_TOKEN);
    }
  }

  getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(environment.GRADEHORARIOS_TOKEN) ?? '';
    }
    return '';
  }

  getExp(): number {
    const token = this.getToken();
    if (!token) return 0;

    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return exp || 0;
    } catch {
      return 0;
    }
  }

  hasToken(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const token = this.getToken();
    if (this.hasExpired() && !!token) {
      this.deleteToken();
      return false;
    }
    return !!token;
  }

  hasExpired(): boolean {
    const exp = this.getExp();
    if (exp === 0) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  }
}

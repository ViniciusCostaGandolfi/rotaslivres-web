import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private cookieService = inject(CookieService);

  saveToken(token: string): void {
    // Save token with 14 days expiration (assuming same as backend)
    this.cookieService.set(environment.ROTASLIVRES_TOKEN, token, 14, '/');
  }

  deleteToken(): void {
    this.cookieService.delete(environment.ROTASLIVRES_TOKEN, '/');
  }

  getToken(): string {
    return this.cookieService.get(environment.ROTASLIVRES_TOKEN) ?? '';
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

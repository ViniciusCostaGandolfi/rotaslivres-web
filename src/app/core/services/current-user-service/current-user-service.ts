import { Injectable } from '@angular/core';
import { TokenUserDto } from '../../interfaces/auth';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from '../jwt-service/jwt-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private userSubject = new BehaviorSubject<TokenUserDto | null>(null);

  constructor(private tokenService: JwtService) {
    if (this.tokenService.hasToken()) {
      this.decodeJWT();
    }
  }

  private decodeJWT() {
    const token = this.tokenService.getToken();
    const user = jwtDecode<TokenUserDto>(token);
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  saveToken(token: string) {
    this.tokenService.saveToken(token);
    this.decodeJWT();
  }

  logout() {
    this.tokenService.deleteToken();
    this.userSubject.next(null);
  }

  hasLogged() {
    return this.tokenService.hasToken();
  }
}

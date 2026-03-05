import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenDto } from '../../interfaces/user';
import { UserCreation, UserLogin } from '../../interfaces/auth';
import { CurrentUserService } from '../current-user-service/current-user-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = environment.ROTASLIVRES_API;
  constructor(
    private http: HttpClient,
    private currentUserService: CurrentUserService
  ) { }

  createUser(user: UserCreation): Observable<TokenDto | any> {
    const url = `${this.apiUrl}/api/auth/sigin`;


    return this.http.post<TokenDto | any>(url, user, { observe: 'response' }).pipe(
      tap(response => {
        const authToken = response.body?.token;
        if (authToken) {
          this.currentUserService.saveToken(authToken);
        }
      })
    );
  }

  login(userLogin: UserLogin): Observable<TokenDto | any> {
    const url = `${this.apiUrl}/api/auth/login`;
    return this.http.post<TokenDto | any>(url, userLogin, { observe: 'response' }).pipe(
      tap(response => {
        const authToken = response.body?.token;
        if (authToken) {
          this.currentUserService.saveToken(authToken);
        }
      })
    );
  }

  refreshToken(): void {
    const url = `${this.apiUrl}/auth/refresh_token`;
    this.http.post<TokenDto | any>(url, { observe: 'response' }).pipe(
      tap(response => {
        const authToken = response.body?.token;
        if (authToken) {
          this.currentUserService.saveToken(authToken);
        } else {
          this.currentUserService.logout()
        }
      })
    );

  }


  requestPasswordReset(email: string): Observable<string> {
    const url = `${this.apiUrl}/api/auth/forgot_password`;
    return this.http.post(url, { email }, { responseType: 'text' });
  }


  resetPassword(payload: { token: string, newPassword: string }): Observable<string> {
    const url = `${this.apiUrl}/api/auth/reset_password`;
    return this.http.post(url, payload, { responseType: 'text' });
  }


  loginWithGoogle(token: string): Observable<any> {
    const url = `${this.apiUrl}/api/auth/google`;
    return this.http.post<any>(url, { token }, { observe: 'response' }).pipe(
      tap(response => {
        const authToken = response.body?.token;
        if (authToken) {
          this.currentUserService.saveToken(authToken);
        }
      })
    );
  }



}

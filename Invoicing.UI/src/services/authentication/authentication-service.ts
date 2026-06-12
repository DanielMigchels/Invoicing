import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginRequestModel } from './models/login-request-model';
import { LoginResponseModel } from './models/login-response-model';
import { RegisterRequestModel } from './models/register-request-model';
import { RegisterResponseModel } from './models/register-response-model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private apiUrl = '/api/authentication';
  private http = inject(HttpClient);
  private router = inject(Router);

  login(loginRequestModel: LoginRequestModel): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(`${this.apiUrl}/login`, loginRequestModel);
  }

  register(registerRequestModel: RegisterRequestModel): Observable<RegisterResponseModel> {
    return this.http.post<RegisterResponseModel>(`${this.apiUrl}/register`, registerRequestModel);
  }

  setJwt(jwt: string) {
    localStorage.setItem('jwt', jwt);
  }

  getJwt(): String | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): boolean {
    const jwt = this.getJwt();
    if (!jwt) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }
}
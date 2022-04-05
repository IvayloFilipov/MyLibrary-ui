import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationUser } from '../models/application-user';
import { environment } from '../../environments/environment';
import jwt_decode from 'jwt-decode';
import { ForgotPasswordInterface } from 'src/app/models/interfaces/forgotPassword.interface';
import { ResetPasswordInterface } from 'src/app/models/interfaces/resetPassword.interface';

interface LoginResultInterface {
  email: string;
  role: string;
  accessToken: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}users`;
  private _user = new BehaviorSubject<ApplicationUser | null>(null);

  user$: Observable<ApplicationUser | null> = this._user.asObservable();
  constructor(private router: Router, private http: HttpClient) {}

  ngOnDestroy(): void {}

  login(email: string, password: string) {
    return this.http
      .post<LoginResultInterface>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map((x) => {
          this._user.next({
            email: x.email,
            role: x.role,
            accessToken: x.accessToken,
            id: x.id,
          });
          this.setLocalStorage(x);
          return x;
        })
      );
  }

  getUserId(): any {
    var id = localStorage.getItem('id');
    return id;
  }

  setLocalStorage(x: LoginResultInterface) {
    localStorage.setItem('access_token', x.accessToken);
    localStorage.setItem('id', x.id);
  }

  clearLocalStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id');
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  getTokenRoles(): any {
    let roles: any;

    const token = localStorage.getItem('access_token');
    if (!token) {
      return null;
    }

    const result = this.getDecodedAccessToken(token);
    const claimRoles =
      result['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (typeof claimRoles === 'string') {
      roles = Array.of(claimRoles);
    } else {
      roles = claimRoles;
    }

    return roles;
  }

  isLoggedOut() {
    if (localStorage.getItem('access_token')) {
      return false;
    } else {
      return true;
    }
  }

  isLibrarian() {
    if (
      this.getTokenRoles() != null &&
      this.getTokenRoles().includes('Librarian')
    ) {
      return true;
    } else {
      return false;
    }
  }

  isAdmin() {
    if (
      this.getTokenRoles() != null &&
      this.getTokenRoles().includes('Admin')
    ) {
      return true;
    } else {
      return false;
    }
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    confirmPassword: string,
    country: string,
    city: string,
    street: string,
    streetNumber: string,
    buildingNumber: string,
    apartmentNumber: string,
    additionalInfo: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      address: {
        country,
        city,
        street,
        streetNumber,
        buildingNumber,
        apartmentNumber,
        additionalInfo,
      },
    });
  }

  requestReset(body: ForgotPasswordInterface): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, body);
  }

  newPassword(body: ResetPasswordInterface): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, body);
  }

  getReadersCount(): Observable<any> {
    return this.http.get(`${environment.apiUrl}home/readers-count`);
  }

  getJwtToken(): string | null {
    return localStorage.getItem('access_token');  
  }
}

// Placeholder for the auth service: https://blog.angular-university.io/angular-jwt-authentication/

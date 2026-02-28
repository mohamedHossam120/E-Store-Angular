import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: BehaviorSubject<any> = new BehaviorSubject(null);

  private readonly baseUrl: string = 'https://ecommerce.routemisr.com/api/v1/auth';

  constructor(
    private _httpClient: HttpClient, 
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) { 
    this.saveUserData();
  }

  saveUserData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('userToken');
      if (token !== null) {
        try {
          const decodedToken = jwtDecode(token);
          this.userData.next(decodedToken); 
        } catch (error) {
          this.logOut(); 
        }
      }
    }
  }

  logOut(): void {
    localStorage.removeItem('userToken');
    this.userData.next(null); 
    this._router.navigate(['/login']);
  }

  sendRegisterData(data: object): Observable<any> {
    return this._httpClient.post(`${this.baseUrl}/signup`, data);
  }

  sendLoginData(data: object): Observable<any> {
    return this._httpClient.post(`${this.baseUrl}/signin`, data);
  }

  forgotPassword(userEmail: object): Observable<any> {
    return this._httpClient.post(`${this.baseUrl}/forgotPasswords`, userEmail);
  }

  verifyCode(data: object): Observable<any> {
    return this._httpClient.post(`${this.baseUrl}/verifyResetCode`, data);
  }

  resetPassword(data: object): Observable<any> {
    return this._httpClient.put(`${this.baseUrl}/resetPassword`, data);
  }
}
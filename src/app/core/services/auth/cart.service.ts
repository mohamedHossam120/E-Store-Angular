import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly baseUrl: string = 'https://ecommerce.routemisr.com/api/v1/cart';
  cartNumber: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private _httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  private getHeaders(): any {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('userToken');
      return token ? { token: token } : null;
    }
    return null;
  }

  addToCart(id: string): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null); 
    return this._httpClient.post(this.baseUrl, { "productId": id }, { headers });
  }

  getLoggedUserCart(): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);
    return this._httpClient.get(this.baseUrl, { headers });
  }

  removeItem(id: string): Observable<any> {
    return this._httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateProductCount(id: string, newCount: number): Observable<any> {
    return this._httpClient.put(`${this.baseUrl}/${id}`, { "count": newCount }, { headers: this.getHeaders() });
  }

  clearCart(): Observable<any> {
    return this._httpClient.delete(this.baseUrl, { headers: this.getHeaders() });
  }
}
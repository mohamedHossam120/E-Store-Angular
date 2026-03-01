import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private _httpClient: HttpClient) {}

  private getHeaders() {
    return {
      token: localStorage.getItem('userToken') || ''
    };
  }

  checkoutSession(cartId: string, shippingData: object): Observable<any> {
  
    const currentOrigin = window.location.origin;

    return this._httpClient.post(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${currentOrigin}`,
      { shippingAddress: shippingData },
      { headers: this.getHeaders() } 
    );
  }
}
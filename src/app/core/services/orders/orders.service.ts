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
    return this._httpClient.post(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200`,
      { shippingAddress: shippingData },
      { headers: this.getHeaders() } 
    );
  }
}
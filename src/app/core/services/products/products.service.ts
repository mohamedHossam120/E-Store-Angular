import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly baseUrl: string = 'https://ecommerce.routemisr.com/api/v1/products';

  constructor(private _httpClient: HttpClient) { }

  getAllProducts(page: number = 1): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}?page=${page}`);
  }

  getProductDetails(id: string): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/${id}`);
  }
} 
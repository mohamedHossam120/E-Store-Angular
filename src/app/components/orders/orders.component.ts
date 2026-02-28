import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  allOrders: any[] = [];
  userId: string = '';
  isLoading: boolean = true;

  constructor(
    private _httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.decodeUserToken();
      this.getUserOrders();
    }
  }

  decodeUserToken(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userId = decoded.id;
      } catch (error) {
        console.error("Token decoding error", error);
      }
    }
  }

  getUserOrders(): void {
    if (!this.userId) {
      this.isLoading = false;
      return;
    }

    this._httpClient.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${this.userId}`)
      .subscribe({
        next: (res: any) => {
          this.allOrders = res;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }
}
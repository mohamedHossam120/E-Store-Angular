import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/auth/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartDetails: any = null;
  isLoading: boolean = true; // خليها true في البداية عشان الـ HTML يعرف إننا بنحمل

  constructor(private _cartService: CartService) {}

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    this.isLoading = true; // تأكيد التشغيل
    this._cartService.getLoggedUserCart().subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.cartDetails = res.data;
        } else {
          this.cartDetails = null; 
        }
        this.isLoading = false; // اقفل اللودر هنا
      },
      error: (err) => {
        console.error(err);
        this.cartDetails = null;
        this.isLoading = false; // اقفل اللودر حتى في الخطأ
      }
    });
  }

  deleteItem(id: string): void {
    this._cartService.removeItem(id).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._cartService.cartNumber.next(res.numOfCartItems);
      },
      error: (err) => console.log(err)
    });
  }

  updateCount(id: string, count: number): void {
    if (count <= 0) {
      this.deleteItem(id);
      return;
    }
    this._cartService.updateProductCount(id, count).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._cartService.cartNumber.next(res.numOfCartItems);
      },
      error: (err) => console.log(err)
    });
  }

  clearAllItems(): void {
    this.isLoading = true;
    this._cartService.clearCart().subscribe({
      next: (res) => {
        if (res.message === 'success') {
          this.cartDetails = null;
          this._cartService.cartNumber.next(0);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../../core/services/auth/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartDetails: any = null;
  isLoading: boolean = true; 
  
  deleteLoadings: string[] = []; 
  countLoadings: string[] = []; 

  private readonly _cartService = inject(CartService);
  private readonly _toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    this.isLoading = true;
    this._cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  deleteItem(id: string): void {
    this.deleteLoadings.push(id); 
    this._cartService.removeItem(id).subscribe({
      next: (res) => {
        this.cartDetails = res.data; 
        this._cartService.cartNumber.next(res.numOfCartItems); 
        this.deleteLoadings = this.deleteLoadings.filter(item => item !== id); 
        this._toastr.warning('Product removed from cart', 'E-Store');
      },
      error: (err) => {
        console.error(err);
        this.deleteLoadings = this.deleteLoadings.filter(item => item !== id);
      }
    });
  }

  updateCount(id: string, count: number): void {
    if (count <= 0) {
      this.deleteItem(id);
      return;
    }

    this.countLoadings.push(id); 
    this._cartService.updateProductCount(id, count).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._cartService.cartNumber.next(res.numOfCartItems);
        this.countLoadings = this.countLoadings.filter(item => item !== id);
        this._toastr.success('Quantity updated successfully', 'E-Store');
      },
      error: (err) => {
        console.error(err);
        this.countLoadings = this.countLoadings.filter(item => item !== id);
      }
    });
  }

  // مسح السلة بالكامل
  clearAllItems(): void {
    this.isLoading = true;
    this._cartService.clearCart().subscribe({
      next: (res) => {
        if (res.message === 'success') {
          this.cartDetails = null;
          this._cartService.cartNumber.next(0);
          this._toastr.error('All items cleared from cart', 'E-Store');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
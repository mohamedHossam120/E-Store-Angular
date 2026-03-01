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
  
  itemLoadings: string[] = []; 

  private readonly _cartService = inject(CartService);
  private readonly _toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    this.isLoading = true;
    this._cartService.getLoggedUserCart().subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.cartDetails = res.data;
        } else {
          this.cartDetails = null; 
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.cartDetails = null;
        this.isLoading = false;
      }
    });
  }

  deleteItem(id: string): void {
    this.itemLoadings.push(id); 
    this._cartService.removeItem(id).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._cartService.cartNumber.next(res.numOfCartItems);
        this.itemLoadings = this.itemLoadings.filter(item => item !== id); 
        this._toastr.warning('Product removed from your cart', 'Cart');
      },
      error: (err) => {
        console.log(err);
        this.itemLoadings = this.itemLoadings.filter(item => item !== id);
      }
    });
  }

  updateCount(id: string, count: number): void {
    if (count <= 0) {
      this.deleteItem(id);
      return;
    }

    this.itemLoadings.push(id); 
    this._cartService.updateProductCount(id, count).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._cartService.cartNumber.next(res.numOfCartItems);
        this.itemLoadings = this.itemLoadings.filter(item => item !== id);
        this._toastr.success('Quantity updated successfully', 'Cart');
      },
      error: (err) => {
        console.log(err);
        this.itemLoadings = this.itemLoadings.filter(item => item !== id);
      }
    });
  }

  clearAllItems(): void {
    this.isLoading = true;
    this._cartService.clearCart().subscribe({
      next: (res) => {
        if (res.message === 'success') {
          this.cartDetails = null;
          this._cartService.cartNumber.next(0);
          this._toastr.error('Your cart is now empty', 'Cart');
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
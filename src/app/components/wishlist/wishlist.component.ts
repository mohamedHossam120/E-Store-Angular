import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { CartService } from '../../core/services/auth/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistDetails: any[] = [];
  isLoaded: boolean = false; // الحارس: بيبدأ بـ false عشان يمنع أي عرض مبكر
  loadings: string[] = []; 

  constructor(
    private _wishlistService: WishlistService,
    private _cartService: CartService,
    private _toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    this.getWishlistData();
  }

  getWishlistData(): void {
    this.isLoaded = false; 
    this._wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistDetails = res?.data || [];
        this.isLoaded = true; // الآن فقط نسمح للـ HTML بالظهور
      },
      error: (err) => {
        console.error(err);
        this.wishlistDetails = [];
        this.isLoaded = true; 
      }
    });
  }

  removeItem(id: string): void {
    this.loadings.push(id);
    this._wishlistService.removeFromWishlist(id).subscribe({
      next: (res) => {
        this.wishlistDetails = this.wishlistDetails.filter((item) => item.id !== id);
        this.loadings = this.loadings.filter(itemId => itemId !== id);
        this._toastr.error('Item removed from wishlist', 'Wishlist'); 
      },
      error: (err) => {
        this.loadings = this.loadings.filter(itemId => itemId !== id);
      }
    });
  }

  addToCart(id: string): void {
    this._cartService.addToCart(id).subscribe({
      next: (res) => {
        this._cartService.cartNumber.next(res.numOfCartItems);
        this._toastr.success(res.message, 'Success'); 
      }
    });
  }
}
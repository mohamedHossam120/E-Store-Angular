import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { CartService } from '../../core/services/auth/cart.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule], // مهم جداً عشان الـ @if والـ currency pipe
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  
  productId: string | null = '';
  productDetails: any = null; // المتغير اللي هيشيل بيانات المنتج

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _productsService: ProductsService,
    private _cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    // 1. التقاط الـ ID من الـ URL
    this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.productId = params.get('id');
      }
    });

    // 2. طلب بيانات المنتج من الـ API باستخدام الـ ID
    if (this.productId) {
      this._productsService.getProductDetails(this.productId).subscribe({
        next: (res) => {
          this.productDetails = res.data;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  // دالة الإضافة للسلة من داخل صفحة التفاصيل
  addToCart(id: string): void {
    this._cartService.addToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this._cartService.cartNumber.next(res.numOfCartItems);
      }
    });
  }
}
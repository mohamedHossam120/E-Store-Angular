import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; 
import { ProductsService } from '../../core/services/products/products.service';
import { CartService } from '../../core/services/auth/cart.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  
  productId: string | null = '';
  productDetails: any = null;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _productsService: ProductsService,
    private _cartService: CartService,
    private _router: Router, 
    private _toastr: ToastrService, 
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.productId = params.get('id');
        
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
    });
  }

  addToCart(id: string): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('userToken') === null) {
        this._toastr.info('Please login first to add products to your cart', 'E-Store');
        this._router.navigate(['/login']);
        return; 
      }
    }

    this._cartService.addToCart(id).subscribe({
      next: (res) => {
        if (res) {
          this._cartService.cartNumber.next(res.numOfCartItems);
          this._toastr.success(res.message, 'Success');
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
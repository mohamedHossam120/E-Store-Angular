import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/auth/cart.service'; 
import { WishlistService } from '../../core/services/wishlist/wishlist.service'; 
import { RouterLink } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { SearchPipe } from '../../core/Pipes/search.pipe';
import { ToastrService } from 'ngx-toastr'; // أضفت التوستر للرسائل

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SearchPipe], 
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  productList: any[] = []; 
  wishlistData: string[] = []; 
  currentPage: number = 1;
  numberOfPages: number = 1;
  text: string = '';
  isLoading: boolean = true;

  // مصفوفات لمتابعة عمليات التحميل لكل منتج بشكل منفصل
  cartLoadings: string[] = []; 
  wishlistLoadings: string[] = [];

  constructor(
    private _productsService: ProductsService,
    private _cartService: CartService,
    private _wishlistService: WishlistService,
    private _toastr: ToastrService, // حقن التوستر
    @Inject(PLATFORM_ID) private platformId: object 
  ) {}

  ngOnInit(): void {
    this.getProductsPage(1);
    if (isPlatformBrowser(this.platformId)) {
      this.loadWishlist();
    }
  }

  loadWishlist(): void {
    this._wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.wishlistData = res.data.map((item: any) => item.id);
        }
      }
    });
  }

  getProductsPage(page: number): void {
    if (page < 1 || (this.numberOfPages > 1 && page > this.numberOfPages)) return;
    
    this.isLoading = true;
    this._productsService.getAllProducts(page).subscribe({
      next: (res) => {
        this.productList = res.data; 
        this.currentPage = res.metadata.currentPage;
        this.numberOfPages = res.metadata.numberOfPages;
        this.isLoading = false; 
        
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.numberOfPages }, (_, i) => i + 1);
  }

  // إضافة للسلة مع Loading
  addToCart(id: string): void {
    this.cartLoadings.push(id); // ابدأ التحميل للزر ده
    this._cartService.addToCart(id).subscribe({
      next: (res) => {
        if (res) {
          this._cartService.cartNumber.next(res.numOfCartItems);
          this._toastr.success(res.message, 'Cart'); // تنبيه نجاح
        }
        this.cartLoadings = this.cartLoadings.filter(item => item !== id); // وقف التحميل
      },
      error: () => {
        this.cartLoadings = this.cartLoadings.filter(item => item !== id);
      }
    });
  }

  // تبديل المفضلة مع Loading للقلب
  toggleWishlist(id: string): void {
    const isInWishlist = this.wishlistData.includes(id);
    this.wishlistLoadings.push(id); // ابدأ التحميل للقلب ده

    const action = isInWishlist 
      ? this._wishlistService.removeFromWishlist(id) 
      : this._wishlistService.addToWishlist(id);

    action.subscribe({
      next: (res) => {
        if (res && res.data) {
          this.wishlistData = res.data;
          this._toastr.info(res.message, 'Wishlist'); // تنبيه
        }
        this.wishlistLoadings = this.wishlistLoadings.filter(item => item !== id);
      },
      error: () => {
        this.wishlistLoadings = this.wishlistLoadings.filter(item => item !== id);
      }
    });
  }
}
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/auth/cart.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.component.html', 
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  
  userName: string | null = null;
  countNumber: number = 0;
  isBrowser: boolean = false; // الحارس

  constructor(
    private _authService: AuthService,
    private _cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: object 
  ) {}

  ngOnInit(): void {
    // تحديد إذا كنا في المتصفح أم لا
    if (isPlatformBrowser(this.platformId)) {
       this.isBrowser = true;
    }

    // 1. مراقبة حالة المستخدم ديناميكياً
    this._authService.userData.subscribe({
      next: (data) => {
        // هنا بيقرأ الاسم من الـ Token المفكوك (زي "حمد")
        this.userName = data ? data.name : null;
        
        if (data && isPlatformBrowser(this.platformId)) {
          this.getCartDataOnLogin();
        }
      }
    });

    // 2. مراقبة التغييرات في السلة
    this._cartService.cartNumber.subscribe({
      next: (val) => {
        this.countNumber = val;
      }
    });
  }

  getCartDataOnLogin(): void {
    this._cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this._cartService.cartNumber.next(res.numOfCartItems);
      },
      error: (err) => console.log("Cart Error:", err)
    });
  }

  callLogOut(): void {
    this._authService.logOut();
    this._cartService.cartNumber.next(0); 
    this.userName = null;
  }
}
import { Routes } from '@angular/router';

import { authGuard } from './core/services/guards/auth.guard';
import { logedGuard } from './core/services/guards/loged.guard';

import { ProductsComponent } from './components/products/products.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { OrdersComponent } from './components/orders/orders.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FotgotPasswordComponent } from './components/fotgot-password/fotgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VerifyCodeComponent } from './components/verify-code/verify-code.component';
import { DetailsComponent } from './components/details/details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  { path: 'products', component: ProductsComponent, title: 'Products' },
  { path: 'details/:id', component: DetailsComponent, title: 'Product Details' },

  { 
    path: 'cart', 
    component: CartComponent, 
    canActivate: [authGuard], 
    title: 'Your Cart' 
  },
  { 
    path: 'wishlist', 
    component: WishlistComponent, 
    canActivate: [authGuard], 
    title: 'Wishlist' 
  },
  { 
    path: 'checkout/:id', 
    component: CheckoutComponent, 
    canActivate: [authGuard], 
    title: 'Checkout' 
  },
  { 
    path: 'allorders', 
    component: OrdersComponent, 
    canActivate: [authGuard], 
    title: 'My Orders' 
  },

  // 4. صفحات الـ Authentication (Loged Guard) - ممنوع يدخلها لو هو عامل Login فعلاً
  { path: 'login', component: LoginComponent, canActivate: [logedGuard], title: 'Login' },
  { path: 'register', component: RegisterComponent, canActivate: [logedGuard], title: 'Register' },
  { path: 'forgot-password', component: FotgotPasswordComponent, canActivate: [logedGuard], title: 'Forgot Password' },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [logedGuard], title: 'Reset Password' },
  { path: 'verify-code', component: VerifyCodeComponent, canActivate: [logedGuard], title: 'Verify Identity' },

  // 5. صفحة الخطأ (Wildcard) - دايماً في الآخر
  { path: '**', component: NotFoundComponent, title: 'Page Not Found' } 
];
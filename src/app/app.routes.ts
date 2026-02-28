import { Routes } from '@angular/router';
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
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component:CartComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'checkout/:id', component: CheckoutComponent },
  { path: 'allorders', component: OrdersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component:FotgotPasswordComponent },
  { path: 'reset-password', component:ResetPasswordComponent },
  { path: 'verify-code', component: VerifyCodeComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: '**', component:NotFoundComponent } 
];
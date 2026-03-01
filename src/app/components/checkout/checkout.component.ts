import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../core/services/orders/orders.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartId: string | null = '';
  isLoading: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _ordersService: OrdersService
  ) {}

  shippingForm: FormGroup = new FormGroup({
    details: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    city: new FormControl(null, [Validators.required, Validators.minLength(3)])
  });

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(params => {
      this.cartId = params.get('id');
    });
  }

  handleForm(): void {
    if (this.shippingForm.valid && this.cartId) {
      this.isLoading = true;
      
      this._ordersService.checkoutSession(this.cartId, this.shippingForm.value).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            window.location.href = res.session.url;
          }
        },
        error: (err) => {
          console.error("Payment Error:", err);
          this.isLoading = false;
        }
      });
    }
  }
}
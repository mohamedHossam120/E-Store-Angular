import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-fotgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './fotgot-password.component.html',
  styleUrl: './fotgot-password.component.css'
})
export class FotgotPasswordComponent {
  isLoading: boolean = false;
  msgError: string = '';

  constructor(private _authService: AuthService,private _router:Router) {}

  forgotForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  submitEmail() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      this._authService.forgotPassword(this.forgotForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this._router.navigate(['/verify-code']);
        },
        error: (err) => {
          this.isLoading = false;
          this.msgError = err.error.message;
        }
      });
    }
  }
}
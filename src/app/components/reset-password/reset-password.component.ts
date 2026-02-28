import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  isLoading: boolean = false;
  msgError: string = '';

  constructor(private _authService: AuthService, private _router: Router) {}

  resetForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [
      Validators.required, 
      Validators.pattern(/^[A-Z][a-z0-9]{5,10}$/) 
    ])
  });

  submitReset(): void {
    if (this.resetForm.valid) {
      this.isLoading = true;
      
      this._authService.resetPassword(this.resetForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.token) {
            localStorage.setItem('userToken', res.token); 
            this._router.navigate(['/login']); 
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.msgError = err.error.message;
        }
      });
    }
  }
}
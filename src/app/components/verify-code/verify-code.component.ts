import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verify-code.component.html'
})
export class VerifyCodeComponent {
  msgError: string = '';
  isLoading: boolean = false;

  constructor(private _authService: AuthService, private _router: Router) {}

  verifyCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)])
  });

  submitVerifyCode() {
    if (this.verifyCodeForm.valid) {
      this.isLoading = true;
      this._authService.verifyCode(this.verifyCodeForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.status === 'Success') {
            this._router.navigate(['/reset-password']);
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
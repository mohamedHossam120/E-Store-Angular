import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css' 
})
export class LoginComponent {
  
  msgError: string = ''; 
  isLoading: boolean = false; 

  constructor(private _authService: AuthService, private _router: Router) {}

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{5,10}$/)])
  });

  submitLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this._authService.sendLoginData(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.message === 'success') {
            localStorage.setItem('userToken', res.token);
            
            this._authService.saveUserData(); 
            
            this._router.navigate(['/products']); 
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
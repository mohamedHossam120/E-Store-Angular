import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.css'
})
export class NavBlankComponent implements OnInit {
  
  userName: string | null = null;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {   
    this._authService.userData.subscribe({
      next: (data) => {
        if (data !== null) {
          this.userName = data.name; 
        } else {
          this.userName = null; 
        }
      }
    });
  }

  callLogOut(): void {
    this._authService.logOut();
  }
}
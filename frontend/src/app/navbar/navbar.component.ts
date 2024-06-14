import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class NavbarComponent {

  constructor(private router: Router, private apiService: ApiService) {}

  refreshCompanyList(event: Event): void {
    event.preventDefault(); 
    this.router.navigate(['/company-list']).then(() => {
      window.location.reload();
    });
  }

  logout(): void {
    console.log('Logout: Starting logout process');
    this.apiService.logout();
    console.log('Logout: Navigating to /login');
    this.router.navigate(['/login']).then(() => {
      // Clear the history state to prevent going back
      window.history.pushState(null, '', '/login');
      window.history.pushState(null, '', '/login');
      window.history.go(-2);
    });
  }
}

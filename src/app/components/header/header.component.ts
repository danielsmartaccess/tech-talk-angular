import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isLoggedIn = false;
  username: string | null = null;
  isAdmin = false;
  private authSubscription: Subscription | null = null;
  
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.username = user?.username || null;
      this.isAdmin = user?.role === 'admin';
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeMobileMenu();
  }
}

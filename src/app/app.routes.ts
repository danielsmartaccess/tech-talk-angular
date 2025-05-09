import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'blog-admin', canActivate: [adminGuard], loadComponent: () => import('./blog/blog-admin.component').then(m => m.BlogAdminComponent) },
  { path: 'plans-pricing', loadComponent: () => import('./components/plans-pricing/plans-pricing.component').then(m => m.PlansPricingComponent) },
  { path: 'shop', loadComponent: () => import('./components/shop/shop.component').then(m => m.ShopComponent) },
  { path: 'event-list', canActivate: [authGuard], loadComponent: () => import('./components/events/events.component').then(m => m.EventsComponent) },
  { path: 'members', canActivate: [authGuard], loadComponent: () => import('./components/members/members.component').then(m => m.MembersComponent) },
  { path: '**', redirectTo: '' }
];

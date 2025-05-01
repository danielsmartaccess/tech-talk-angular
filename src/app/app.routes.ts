import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-admin', loadComponent: () => import('./blog/blog-admin.component').then(m => m.BlogAdminComponent) },
  { path: 'plans-pricing', loadComponent: () => import('./components/plans-pricing/plans-pricing.component').then(m => m.PlansPricingComponent) },
  { path: 'shop', loadComponent: () => import('./components/shop/shop.component').then(m => m.ShopComponent) },
  { path: 'event-list', loadComponent: () => import('./components/events/events.component').then(m => m.EventsComponent) },
  { path: 'members', loadComponent: () => import('./components/members/members.component').then(m => m.MembersComponent) },
  { path: '**', redirectTo: '' }
];

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { authGuard, adminGuard } from './guards/auth.guard';
import { inject } from '@angular/core';
import { CanonicalService } from './services/canonical.service';

/**
 * Função auxiliar para definir URL canônica em cada navegação
 * @param path Caminho opcional para a URL canônica
 * @returns Função que configura a URL canônica
 */
const withCanonical = (path?: string) => {
  return () => {
    const canonicalService = inject(CanonicalService);
    canonicalService.setCanonicalUrl(path);
    return true;
  };
};

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    canActivate: [() => withCanonical('/')()],
    title: 'Go Tech Talk | Tecnologia para a Melhor Idade de forma Simples e Intuitiva'
  },
  {
    path: 'schema-test',
    loadComponent: () => import('./components/schema-test/schema-test.component').then(m => m.SchemaTestComponent),
    title: 'Teste de Schema.org | Go Tech Talk'
  },
  { 
    path: 'blog', 
    component: BlogComponent, 
    canActivate: [() => withCanonical('/blog')()],
    title: 'Blog Go Tech Talk | Artigos sobre Tecnologia para a Melhor Idade'
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [() => withCanonical('/login')()],
    title: 'Login | Go Tech Talk | Acesse sua conta'
  },
  { 
    path: 'blog-admin', 
    canActivate: [adminGuard, () => withCanonical('/blog-admin')()], 
    loadComponent: () => import('./blog/blog-admin.component').then(m => m.BlogAdminComponent),
    title: 'Administração do Blog | Go Tech Talk'
  },
  { 
    path: 'plans-pricing', 
    loadComponent: () => import('./components/plans-pricing/plans-pricing.component').then(m => m.PlansPricingComponent),
    canActivate: [() => withCanonical('/plans-pricing')()],
    title: 'Planos e Preços | Go Tech Talk | Escolha o Plano Ideal'
  },
  { 
    path: 'shop', 
    loadComponent: () => import('./components/shop/shop.component').then(m => m.ShopComponent),
    canActivate: [() => withCanonical('/shop')()],
    title: 'Loja Go Tech Talk | Produtos para Aprendizado Tecnológico'
  },
  { 
    path: 'eventos', 
    loadComponent: () => import('./components/events/events.component').then(m => m.EventsComponent),
    canActivate: [authGuard, () => withCanonical('/eventos')()],
    title: 'Eventos Go Tech Talk | Encontros e Workshops de Tecnologia'
  },
  { 
    path: 'event-list', 
    redirectTo: 'eventos',
    pathMatch: 'full'
  },
  { 
    path: 'membros', 
    loadComponent: () => import('./components/members/members.component').then(m => m.MembersComponent),
    canActivate: [authGuard, () => withCanonical('/membros')()],
    title: 'Membros Go Tech Talk | Nossa Comunidade de Tecnologia para a Melhor Idade'
  },
  { 
    path: 'members', 
    redirectTo: 'membros',
    pathMatch: 'full'
  },
  { 
    path: 'faq', 
    loadComponent: () => import('./components/faq/faq.component').then(m => m.FaqComponent),
    canActivate: [() => withCanonical('/faq')()],
    title: 'Perguntas Frequentes | Go Tech Talk | Tire suas Dúvidas'
  },
  { 
    path: 'not-found', 
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Página não encontrada | Go Tech Talk | Erro 404'
  },
  { 
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

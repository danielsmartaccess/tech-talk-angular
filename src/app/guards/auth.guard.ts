import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rotas que requerem autenticação
 * 
 * Verifica se o usuário está autenticado antes de permitir acesso à rota
 * Se não estiver autenticado, redireciona para a página de login
 * preservando a URL original como returnUrl para redirecionamento posterior
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  }
  
  // Se não estiver logado, redireciona para a página de login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * Guard para proteger rotas que requerem perfil de administrador
 * 
 * Verifica se o usuário está autenticado e possui o role 'admin'
 * Se estiver autenticado mas não for admin, redireciona para a home
 * Se não estiver autenticado, redireciona para a página de login
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn() && authService.hasRole('admin')) {
    return true;
  }
  
  if (authService.isLoggedIn()) {
    // Se estiver logado mas não for admin, redireciona para a página inicial
    router.navigate(['/']);
    return false;
  }
  
  // Se não estiver logado, redireciona para a página de login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

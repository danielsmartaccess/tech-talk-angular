import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
  isActive: boolean;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="breadcrumb-container" aria-label="Breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
      <ol class="breadcrumb-list">
        <li 
          class="breadcrumb-item" 
          itemprop="itemListElement" 
          itemscope 
          itemtype="https://schema.org/ListItem"
        >
          <a 
            [routerLink]="['/']" 
            itemprop="item"
            aria-label="Página Inicial"
          >
            <span itemprop="name">Início</span>
          </a>
          <meta itemprop="position" content="1" />
        </li>
        
        <li 
          *ngFor="let breadcrumb of breadcrumbs; let i = index" 
          class="breadcrumb-item" 
          [class.active]="breadcrumb.isActive"
          itemprop="itemListElement" 
          itemscope 
          itemtype="https://schema.org/ListItem"
        >
          <span *ngIf="breadcrumb.isActive; else breadcrumbLink" itemprop="name">
            {{ breadcrumb.label }}
          </span>
          <ng-template #breadcrumbLink>
            <a 
              [routerLink]="[breadcrumb.url]" 
              itemprop="item"
              [attr.aria-current]="breadcrumb.isActive ? 'page' : null"
            >
              <span itemprop="name">{{ breadcrumb.label }}</span>
            </a>
          </ng-template>
          <meta itemprop="position" [attr.content]="i + 2" />
        </li>
      </ol>
    </nav>
  `,
  styles: `
    .breadcrumb-container {
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      background-color: #f8f9fa;
      border-radius: 0.25rem;
      font-size: 0.9rem;
    }
    
    .breadcrumb-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      margin: 0;
      list-style: none;
    }
    
    .breadcrumb-item {
      display: flex;
      align-items: center;
    }
    
    .breadcrumb-item + .breadcrumb-item {
      padding-left: 0.5rem;
    }
    
    .breadcrumb-item + .breadcrumb-item::before {
      display: inline-block;
      padding-right: 0.5rem;
      color: #6c757d;
      content: "/";
    }
    
    .breadcrumb-item a {
      color: var(--primary-color, #0d6efd);
      text-decoration: none;
    }
    
    .breadcrumb-item a:hover {
      text-decoration: underline;
    }
    
    .breadcrumb-item.active {
      color: #6c757d;
      font-weight: 500;
    }
    
    /* Responsividade para telas pequenas */
    @media (max-width: 576px) {
      .breadcrumb-container {
        padding: 0.5rem;
        font-size: 0.8rem;
      }
    }
  `
})
export class BreadcrumbsComponent implements OnInit {
  @Input() customBreadcrumbs: Breadcrumb[] | null = null;
  breadcrumbs: Breadcrumb[] = [];

  private readonly routeLabels: { [key: string]: string } = {
    '': 'Página Inicial',
    'blog': 'Blog',
    'membros': 'Membros',
    'eventos': 'Eventos',
    'loja': 'Loja',
    'planos-precos': 'Planos e Preços',
    'login': 'Login',
    'registro': 'Cadastro',
    'contato': 'Contato',
    'ajuda': 'Ajuda',
    'sobre': 'Sobre Nós'
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // Se breadcrumbs personalizados foram fornecidos, use-os
    if (this.customBreadcrumbs) {
      this.breadcrumbs = this.customBreadcrumbs;
      return;
    }

    // Caso contrário, gere os breadcrumbs com base na rota atual
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    });

    // Gere os breadcrumbs iniciais
    this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
  }

  /**
   * Cria os breadcrumbs com base na rota ativada
   * @param route Rota ativada atual
   * @param url URL acumulada
   * @returns Array de breadcrumbs
   */
  private createBreadcrumbs(route: ActivatedRoute, url: string = ''): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];
    
    // Obtém os fragmentos da rota
    const children: ActivatedRoute[] = route.children;
    
    if (children.length === 0) {
      return breadcrumbs;
    }
    
    // Percorre as rotas filhas
    for (const child of children) {
      // Apenas para rotas primárias e não para outlets
      if (child.outlet !== 'primary') {
        continue;
      }
      
      // Obtém o fragmento da rota
      const routeSnapshot = child.snapshot;
      
      // Constrói a URL da rota
      const routeUrl = routeSnapshot.url.map(segment => segment.path).join('/');
      
      // Adiciona o fragmento à URL atual
      const nextUrl = url.length > 0 ? `${url}/${routeUrl}` : routeUrl;
      
      // Se temos um path, adicione aos breadcrumbs
      if (routeUrl) {
        // Verificar se temos um rótulo personalizado para esta rota
        const label = this.getRouteLabel(routeUrl, routeSnapshot.data);
        
        breadcrumbs.push({
          label,
          url: '/' + nextUrl,
          isActive: this.router.url === '/' + nextUrl
        });
      }
      
      // Adiciona os breadcrumbs das rotas filhas
      breadcrumbs.push(...this.createBreadcrumbs(child, nextUrl));
    }
    
    return breadcrumbs;
  }
  
  /**
   * Obtém o rótulo para uma rota específica
   * @param path Caminho da rota
   * @param data Dados associados à rota
   * @returns Rótulo da rota
   */
  private getRouteLabel(path: string, data: any): string {
    // Primeiro, verifique se há um título nos dados da rota
    if (data && data['title']) {
      return data['title'];
    }
    
    // Caso contrário, use o mapeamento predefinido ou capitalize a rota
    return this.routeLabels[path] || this.capitalize(path);
  }
  
  /**
   * Capitaliza a primeira letra de uma string
   * @param value String para capitalizar
   * @returns String capitalizada
   */
  private capitalize(value: string): string {
    return value
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

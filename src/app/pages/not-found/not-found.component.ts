import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="not-found-container">
      <div class="not-found-content">
        <h1 class="not-found-title">Página não encontrada</h1>
        <p class="not-found-desc">Desculpe, não conseguimos encontrar a página que você procura.</p>
        
        <div class="error-code">404</div>
        
        <div class="not-found-actions">
          <a routerLink="/" class="home-btn">
            <i class="fas fa-home" aria-hidden="true"></i>
            Voltar para a página inicial
          </a>
          
          <a routerLink="/contato" class="contact-btn">
            <i class="fas fa-envelope" aria-hidden="true"></i>
            Entre em contato
          </a>
        </div>
        
        <div class="not-found-help">
          <h2>Você pode tentar:</h2>
          <ul>
            <li>Verificar o endereço digitado</li>
            <li>Usar a busca do site</li>
            <li>Navegar pelo menu principal</li>
            <li>Voltar para a página anterior</li>
          </ul>
        </div>
      </div>
      
      <div class="popular-links">
        <h3>Links Populares</h3>
        <ul>
          <li><a routerLink="/blog">Blog</a></li>
          <li><a routerLink="/eventos">Eventos</a></li>
          <li><a routerLink="/planos-precos">Planos e Preços</a></li>
          <li><a routerLink="/loja">Loja</a></li>
        </ul>
      </div>
    </main>
  `,
  styles: `
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      min-height: calc(100vh - 200px);
      text-align: center;
    }
    
    .not-found-title {
      font-size: 2.5rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
    }
    
    .not-found-desc {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      max-width: 600px;
    }
    
    .error-code {
      font-size: 8rem;
      font-weight: bold;
      color: rgba(0,0,0,0.1);
      margin: 1rem 0 2rem;
    }
    
    .not-found-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin: 2rem 0;
    }
    
    .home-btn, .contact-btn {
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .home-btn {
      background-color: var(--primary-color);
      color: white;
    }
    
    .contact-btn {
      background-color: transparent;
      border: 2px solid var(--primary-color);
      color: var(--primary-color);
    }
    
    .home-btn:hover, .contact-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .not-found-help {
      margin: 3rem 0;
      text-align: left;
      max-width: 500px;
    }
    
    .not-found-help h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .not-found-help ul {
      padding-left: 1.5rem;
    }
    
    .not-found-help li {
      margin-bottom: 0.5rem;
    }
    
    .popular-links {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #eee;
      width: 100%;
      max-width: 600px;
    }
    
    .popular-links h3 {
      margin-bottom: 1rem;
    }
    
    .popular-links ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
      list-style: none;
      padding: 0;
    }
    
    .popular-links a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }
    
    .popular-links a:hover {
      text-decoration: underline;
    }
    
    /* Responsividade */
    @media (max-width: 600px) {
      .not-found-title {
        font-size: 2rem;
      }
      
      .not-found-desc {
        font-size: 1rem;
      }
      
      .error-code {
        font-size: 6rem;
      }
      
      .not-found-actions {
        flex-direction: column;
      }
    }
  `
})
export class NotFoundComponent implements OnInit {
  private seoService = inject(SeoService);
  
  ngOnInit(): void {
    // Configurar SEO para página 404
    this.seoService.updateAll({
      title: 'Página não encontrada | Go Tech Talk | Erro 404',
      description: 'A página que você está procurando não existe ou foi movida. Explore outras páginas do Go Tech Talk ou volte para a página inicial.',
      keywords: 'página não encontrada, erro 404, go tech talk',
      url: window.location.href,
      type: 'website'
    });
  }
}

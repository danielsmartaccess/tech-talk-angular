import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Serviço para gerenciamento de URLs canônicas
 * Responsável por definir e atualizar as URLs canônicas para evitar conteúdo duplicado
 */
@Injectable({
  providedIn: 'root'
})
export class CanonicalService {
  private baseUrl = 'https://gotechtalks.com.br';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Define a URL canônica para a página atual
   * @param path Caminho relativo opcional (se não fornecido, usa o caminho atual)
   */
  setCanonicalUrl(path?: string): void {
    const canonicalUrl = path 
      ? `${this.baseUrl}${path}` 
      : this.generateCanonicalUrl();
    
    this.updateCanonicalElement(canonicalUrl);
  }

  /**
   * Gera a URL canônica com base no caminho atual
   * @returns URL canônica completa
   */
  private generateCanonicalUrl(): string {
    // Remove parâmetros de consulta e hash da URL
    const url = this.document.location.href.split('?')[0].split('#')[0];
    return url;
  }

  /**
   * Atualiza ou cria o elemento link canônico no head do documento
   * @param url URL canônica a ser definida
   */
  private updateCanonicalElement(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    
    if (link) {
      // Atualiza o elemento existente
      link.setAttribute('href', url);
    } else {
      // Cria um novo elemento link canônico
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.document.head.appendChild(link);
    }
  }

  /**
   * Adiciona tags rel="prev" e rel="next" para navegação de paginação
   * @param prevUrl URL da página anterior (ou null se for a primeira página)
   * @param nextUrl URL da página seguinte (ou null se for a última página)
   */
  setPaginationLinks(prevUrl: string | null, nextUrl: string | null): void {
    // Remove links existentes de paginação
    this.removePaginationLinks();

    // Adiciona link para página anterior, se existir
    if (prevUrl) {
      const prevLink = this.document.createElement('link');
      prevLink.setAttribute('rel', 'prev');
      prevLink.setAttribute('href', prevUrl);
      this.document.head.appendChild(prevLink);
    }

    // Adiciona link para próxima página, se existir
    if (nextUrl) {
      const nextLink = this.document.createElement('link');
      nextLink.setAttribute('rel', 'next');
      nextLink.setAttribute('href', nextUrl);
      this.document.head.appendChild(nextLink);
    }
  }

  /**
   * Remove tags rel="prev" e rel="next" do head
   */
  private removePaginationLinks(): void {
    const prevLink = this.document.querySelector('link[rel="prev"]');
    if (prevLink) {
      prevLink.remove();
    }

    const nextLink = this.document.querySelector('link[rel="next"]');
    if (nextLink) {
      nextLink.remove();
    }
  }
}

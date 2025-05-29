import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  /**
   * Configura o título da página
   * @param title Título da página
   */
  updateTitle(title: string): void {
    this.title.setTitle(title);
  }

  /**
   * Configura a descrição da página
   * @param description Descrição da página
   */
  updateDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
  }

  /**
   * Configura as palavras-chave da página
   * @param keywords Palavras-chave da página
   */
  updateKeywords(keywords: string): void {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  /**
   * Configura os metadados do Open Graph
   * @param config Configurações do Open Graph
   */
  updateOgTags(config: {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
    type?: string;
  }): void {
    if (config.title) {
      this.meta.updateTag({ property: 'og:title', content: config.title });
    }
    if (config.description) {
      this.meta.updateTag({ property: 'og:description', content: config.description });
    }
    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }
    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }
    if (config.type) {
      this.meta.updateTag({ property: 'og:type', content: config.type });
    }
  }

  /**
   * Configura os metadados do Twitter Card
   * @param config Configurações do Twitter Card
   */
  updateTwitterTags(config: {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
    card?: string;
  }): void {
    if (config.title) {
      this.meta.updateTag({ property: 'twitter:title', content: config.title });
    }
    if (config.description) {
      this.meta.updateTag({ property: 'twitter:description', content: config.description });
    }
    if (config.url) {
      this.meta.updateTag({ property: 'twitter:url', content: config.url });
    }
    if (config.image) {
      this.meta.updateTag({ property: 'twitter:image', content: config.image });
    }
    if (config.card) {
      this.meta.updateTag({ property: 'twitter:card', content: config.card });
    }
  }

  /**
   * Configura os metadados de SEO para uma página
   * @param config Configuração completa de SEO
   */
  updateAll(config: {
    title: string;
    description: string;
    keywords?: string;
    type?: string;
    url?: string;
    image?: string;
    twitterCard?: string;
  }): void {
    // Configura title e description básicos
    this.updateTitle(config.title);
    this.updateDescription(config.description);
    
    // Configura keywords se fornecidas
    if (config.keywords) {
      this.updateKeywords(config.keywords);
    }
    
    // Configura Open Graph
    this.updateOgTags({
      title: config.title,
      description: config.description,
      url: config.url,
      image: config.image,
      type: config.type || 'website'
    });
    
    // Configura Twitter Card
    this.updateTwitterTags({
      title: config.title,
      description: config.description,
      url: config.url,
      image: config.image,
      card: config.twitterCard || 'summary_large_image'
    });
  }

  /**
   * Adiciona um JSON-LD estruturado a uma página
   * @param schema Objeto com os dados estruturados
   */
  addJsonLd(schema: object): void {
    // Remove quaisquer scripts JSON-LD existentes com o mesmo ID
    const id = 'dynamic-jsonld';
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }
    
    // Cria e adiciona o novo script JSON-LD
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }
  
  /**
   * Remove um JSON-LD estruturado de uma página
   */
  removeJsonLd(): void {
    const script = document.getElementById('dynamic-jsonld');
    if (script) {
      script.remove();
    }
  }
}

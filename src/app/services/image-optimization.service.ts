import { Injectable } from '@angular/core';

/**
 * Interface para configuração de imagem
 */
export interface ImageConfig {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  loading?: 'lazy' | 'eager';
  alt: string;
}

/**
 * Serviço para otimização de imagens
 * Responsável por gerenciar o carregamento otimizado de imagens para melhorar o desempenho
 */
@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private defaultQuality = 80;
  private defaultFormat = 'webp';
  private defaultLoading = 'lazy';
  private imageCDNUrl = 'https://gotechtalks.com.br/img';

  constructor() { }

  /**
   * Gera uma URL otimizada para a imagem
   * @param config Configuração da imagem
   * @returns URL otimizada com parâmetros para redimensionamento e compressão
   */
  getOptimizedImageUrl(config: ImageConfig): string {
    const {
      src,
      width,
      height,
      quality = this.defaultQuality,
      format = this.defaultFormat
    } = config;

    // Verifica se a URL já é externa ou absoluta
    if (src.startsWith('http') || src.startsWith('//')) {
      return src;
    }

    // Constrói a URL para o CDN de imagens
    let optimizedUrl = `${this.imageCDNUrl}?src=${encodeURIComponent(src)}`;
    
    // Adiciona parâmetros de otimização
    if (width) optimizedUrl += `&w=${width}`;
    if (height) optimizedUrl += `&h=${height}`;
    optimizedUrl += `&q=${quality}&fm=${format}`;

    return optimizedUrl;
  }

  /**
   * Gera um conjunto de URLs para srcset responsivo
   * @param config Configuração da imagem
   * @param breakpoints Pontos de quebra para responsividade (larguras em pixels)
   * @returns String formatada para o atributo srcset
   */
  generateSrcSet(config: ImageConfig, breakpoints: number[] = [320, 640, 768, 1024, 1366, 1600]): string {
    return breakpoints
      .map(width => {
        const imgConfig = { ...config, width };
        return `${this.getOptimizedImageUrl(imgConfig)} ${width}w`;
      })
      .join(', ');
  }

  /**
   * Pré-carrega imagens importantes para melhorar a percepção de velocidade
   * @param images Array de URLs de imagens para pré-carregar
   */
  preloadImages(images: string[]): void {
    images.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  /**
   * Gera elementos HTML <picture> para melhor suporte a formatos modernos
   * @param config Configuração da imagem
   * @returns String HTML com o elemento picture e suas sources
   */
  generatePictureElement(config: ImageConfig): string {
    const { src, alt, width, height, loading = this.defaultLoading } = config;
    
    return `<picture>
      <source srcset="${this.getOptimizedImageUrl({ ...config, format: 'avif' })}" type="image/avif">
      <source srcset="${this.getOptimizedImageUrl({ ...config, format: 'webp' })}" type="image/webp">
      <img 
        src="${this.getOptimizedImageUrl({ ...config, format: 'jpeg' })}" 
        alt="${alt}" 
        ${width ? `width="${width}"` : ''} 
        ${height ? `height="${height}"` : ''} 
        loading="${loading}"
      >
    </picture>`;
  }

  /**
   * Verifica se o navegador suporta lazy loading nativo
   * @returns true se o navegador suportar lazy loading
   */
  supportsNativeLazyLoading(): boolean {
    return 'loading' in HTMLImageElement.prototype;
  }

  /**
   * Implementa lazy loading em imagens existentes na página
   * Usado como fallback para navegadores que não suportam lazy loading nativo
   */
  applyLazyLoading(): void {
    if (this.supportsNativeLazyLoading()) {
      console.log('Lazy loading nativo suportado pelo navegador');
      return;
    }

    // Implementação de lazy loading com Intersection Observer
    const images = document.querySelectorAll('img[data-src]');
    const config = {
      rootMargin: '50px 0px',
      threshold: 0.01
    };

    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          
          self.unobserve(entry.target);
        }
      });
    }, config);

    images.forEach(img => {
      observer.observe(img);
    });
  }

  /**
   * Aplica técnicas de otimização de CLS (Cumulative Layout Shift)
   * Reserva espaço para imagens antes do carregamento
   */
  applyCLSPrevention(): void {
    const images = document.querySelectorAll('img[width][height]');
    
    images.forEach(img => {
      const imgElement = img as HTMLImageElement;
      
      if (imgElement.width && imgElement.height) {
        imgElement.style.aspectRatio = `${imgElement.width} / ${imgElement.height}`;
        imgElement.style.width = '100%';
        imgElement.style.height = 'auto';
      }
    });
  }
}

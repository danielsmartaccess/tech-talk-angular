import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Interface para configuração de fonte
 */
interface FontConfig {
  family: string;
  weight?: string;
  style?: string;
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
  unicodeRange?: string;
}

/**
 * Serviço para otimização de recursos web
 * Responsável por melhorar o carregamento de fontes, CSS e outros recursos para
 * otimizar métricas Core Web Vitals (LCP, INP, CLS)
 */
@Injectable({
  providedIn: 'root'
})
export class ResourceOptimizationService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Inicializa otimizações de recursos web
   * Chamado no início da aplicação para configurar todas as otimizações
   */
  initialize(): void {
    // Configura as fontes principais com preload
    this.optimizeFonts([
      { family: 'Roboto', weight: '400,500,700', display: 'swap', preload: true },
      { family: 'Material Icons', display: 'block', preload: true }
    ]);
    
    // Otimiza CSS crítico
    this.inlineCriticalCSS();
    
    // Inicializa observador de layout shifts
    this.monitorLayoutShifts();
  }

  /**
   * Otimiza o carregamento de fontes web
   * @param fonts Configurações das fontes a serem otimizadas
   */
  optimizeFonts(fonts: FontConfig[]): void {
    fonts.forEach(font => {
      // Configuração do Font Display para melhorar o CLS
      this.addFontDisplayCSS(font);
      
      // Preload para fontes importantes
      if (font.preload) {
        this.preloadFont(font);
      }
    });
  }
  
  /**
   * Adiciona regra CSS para controlar o font-display
   * @param font Configuração da fonte
   */
  private addFontDisplayCSS(font: FontConfig): void {
    const style = this.document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: ${font.family};
        ${font.weight ? `font-weight: ${font.weight};` : ''}
        ${font.style ? `font-style: ${font.style};` : ''}
        font-display: ${font.display || 'swap'};
        ${font.unicodeRange ? `unicode-range: ${font.unicodeRange};` : ''}
      }
    `;
    this.document.head.appendChild(style);
  }

  /**
   * Precarrega fontes importantes
   * @param font Configuração da fonte para preload
   */
  private preloadFont(font: FontConfig): void {
    const weights = (font.weight || '400').split(',');
    
    weights.forEach(weight => {
      const link = this.document.createElement('link');
      link.rel = 'preload';
      link.href = `https://fonts.googleapis.com/css2?family=${font.family.replace(' ', '+')}:wght@${weight}&display=${font.display || 'swap'}`;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      
      this.document.head.appendChild(link);
    });
  }
  
  /**
   * Inline CSS crítico para eliminar recursos bloqueantes de renderização
   */
  inlineCriticalCSS(): void {
    // CSS crítico para renderização inicial
    const criticalCSS = `
      :root {
        --primary-color: #4285f4;
        --text-color: #333;
        --bg-color: #fff;
        --font-family: 'Roboto', sans-serif;
      }
      
      body, html {
        margin: 0;
        padding: 0;
        font-family: var(--font-family);
        color: var(--text-color);
        background: var(--bg-color);
      }
      
      .header, .footer {
        width: 100%;
        box-sizing: border-box;
      }
      
      /* Estilos para prevenir CLS */
      img, video {
        max-width: 100%;
        height: auto;
      }
      
      /* Skeleton de carregamento */
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
      }
      
      @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    
    const style = this.document.createElement('style');
    style.textContent = criticalCSS;
    this.document.head.appendChild(style);
  }
  
  /**
   * Monitora Layout Shifts (CLS) para diagnóstico
   */
  private monitorLayoutShifts(): void {
    if (!('PerformanceObserver' in window)) {
      console.log('PerformanceObserver não suportado neste navegador');
      return;
    }
    
    try {      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Correção: hadRecentInput deve ser acessado após fazer cast para LayoutShiftEntry
          if ((entry as any).hadRecentInput) continue;
          
          // Registra shifts significativos para diagnóstico
          if ((entry as any).value > 0.01) {
            console.warn('Detectado Layout Shift:', entry);
          }
        }
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('Erro ao monitorar Layout Shifts:', e);
    }
  }

  /**
   * Otimiza recursos terceiros com preconnect e dns-prefetch
   * @param domains Domínios externos para otimizar conexão
   */
  optimizeThirdPartyResources(domains: string[]): void {
    domains.forEach(domain => {
      // DNS-prefetch para todos os domínios
      const dnsPrefetch = this.document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = domain;
      this.document.head.appendChild(dnsPrefetch);
      
      // Preconnect para domínios críticos
      const preconnect = this.document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = domain;
      preconnect.crossOrigin = 'anonymous';
      this.document.head.appendChild(preconnect);
    });
  }
  
  /**
   * Aplica lazy loading em iframes, scripts não críticos e outros recursos
   */
  applyLazyLoadingToAllResources(): void {
    // Lazy loading para iframes
    document.querySelectorAll('iframe').forEach(iframe => {
      if (!iframe.hasAttribute('loading')) {
        iframe.setAttribute('loading', 'lazy');
      }
    });
    
    // Lazy loading para scripts não críticos
    document.querySelectorAll('script[data-lazy]').forEach(script => {
      const src = script.getAttribute('data-src');
      if (src) {
        // Atribui o src apenas quando necessário
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const lazyScript = entry.target as HTMLScriptElement;
              lazyScript.src = src;
              observer.unobserve(lazyScript);
            }
          });
        });
        
        observer.observe(script);
      }
    });
  }
}

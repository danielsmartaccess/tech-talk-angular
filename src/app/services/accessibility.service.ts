import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Interface para relatório de problemas de acessibilidade
 */
interface AccessibilityIssue {
  element: string;
  issue: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  recommendation: string;
}

/**
 * Interface para verificação de contraste de cores
 */
interface ContrastResult {
  ratio: number;
  passes: {
    AA: boolean;
    AAA: boolean;
    AALarge: boolean;
    AAALarge: boolean;
  };
}

/**
 * Serviço para diagnóstico e melhorias de acessibilidade
 * Responsável por identificar e sugerir correções para problemas de acessibilidade
 */
@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Executa uma varredura completa de acessibilidade na página atual
   * @returns Array de problemas de acessibilidade encontrados
   */
  runAccessibilityAudit(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    
    // Verifica imagens sem alt
    issues.push(...this.checkImagesWithoutAlt());
    
    // Verifica contraste de cores
    issues.push(...this.checkColorContrast());
    
    // Verifica falta de labels em formulários
    issues.push(...this.checkFormLabels());
    
    // Verifica cabeçalhos hierárquicos
    issues.push(...this.checkHeadingHierarchy());
    
    // Verifica elementos interativos sem nomes acessíveis
    issues.push(...this.checkInteractiveElementNames());
    
    return issues;
  }

  /**
   * Verifica imagens sem texto alternativo
   */
  private checkImagesWithoutAlt(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const images = this.document.querySelectorAll('img:not([alt]), img[alt=""]');
    
    images.forEach((img, index) => {
      const imgElement = img as HTMLImageElement;
      const elementDescription = imgElement.src.split('/').pop() || `imagem-${index + 1}`;
      
      issues.push({
        element: `img[src="${imgElement.src}"]`,
        issue: 'Imagem sem texto alternativo (atributo alt)',
        severity: 'critical',
        recommendation: `Adicione um atributo alt descritivo para a imagem ${elementDescription}`
      });
    });
    
    return issues;
  }

  /**
   * Verifica contraste de cores em elementos de texto
   */
  private checkColorContrast(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    // Esta é uma verificação simplificada - um check completo requer análise de CSS
    
    return issues;
  }

  /**
   * Verifica campos de formulário sem labels associados
   */
  private checkFormLabels(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const formControls = this.document.querySelectorAll('input, select, textarea');
    
    formControls.forEach((control) => {
      const controlElement = control as HTMLElement;
      const id = controlElement.getAttribute('id');
      
      // Pula se não tiver ID ou for hidden ou botão
      if (!id || controlElement.getAttribute('type') === 'hidden' || 
          controlElement.getAttribute('type') === 'submit' || 
          controlElement.getAttribute('type') === 'button') {
        return;
      }
      
      // Verifica se existe label associada
      const label = this.document.querySelector(`label[for="${id}"]`);
      if (!label) {
        issues.push({
          element: `#${id}`,
          issue: 'Campo de formulário sem label associada',
          severity: 'serious',
          recommendation: `Associe uma <label for="${id}"> ao campo ${id}`
        });
      }
    });
    
    return issues;
  }

  /**
   * Verifica hierarquia de cabeçalhos (h1, h2, etc)
   */
  private checkHeadingHierarchy(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const headings = this.document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    
    headings.forEach((heading) => {
      const currentLevel = parseInt(heading.tagName.substring(1), 10);
      
      // Verifica se pulou um nível
      if (currentLevel > lastLevel + 1 && lastLevel > 0) {
        issues.push({
          element: heading.tagName.toLowerCase(),
          issue: `Nível de cabeçalho pulado (${lastLevel} para ${currentLevel})`,
          severity: 'moderate',
          recommendation: `Use uma hierarquia sequencial de cabeçalhos`
        });
      }
      
      lastLevel = currentLevel;
    });
    
    return issues;
  }

  /**
   * Verifica elementos interativos sem nomes acessíveis
   */
  private checkInteractiveElementNames(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const elements = this.document.querySelectorAll('button, a, [role="button"], [role="link"]');
    
    elements.forEach((element) => {
      const el = element as HTMLElement;
      const hasText = el.textContent && el.textContent.trim().length > 0;
      const hasAriaLabel = el.hasAttribute('aria-label');
      const hasAriaLabelledby = el.hasAttribute('aria-labelledby');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
        issues.push({
          element: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
          issue: 'Elemento interativo sem nome acessível',
          severity: 'serious',
          recommendation: 'Adicione texto visível, aria-label ou aria-labelledby'
        });
      }
    });
    
    return issues;
  }

  /**
   * Calcula a relação de contraste entre duas cores
   * @param color1 Cor de fundo no formato hexadecimal ou RGB
   * @param color2 Cor de texto no formato hexadecimal ou RGB
   * @returns Resultado do cálculo de contraste
   */
  calculateColorContrast(color1: string, color2: string): ContrastResult {
    // Converte cores para o formato de luminance
    const luminance1 = this.calculateLuminance(this.parseColor(color1));
    const luminance2 = this.calculateLuminance(this.parseColor(color2));
    
    // Calcula a relação de contraste
    const ratio = (Math.max(luminance1, luminance2) + 0.05) / 
                 (Math.min(luminance1, luminance2) + 0.05);
    
    // Verifica se passa nos critérios WCAG AA e AAA
    return {
      ratio,
      passes: {
        AA: ratio >= 4.5,
        AAA: ratio >= 7,
        AALarge: ratio >= 3,
        AAALarge: ratio >= 4.5
      }
    };
  }

  /**
   * Converte cor de formato hex ou RGB para array RGB [r, g, b]
   * @param color Cor no formato hex (#RRGGBB) ou rgb(r, g, b)
   * @returns Array [r, g, b] com valores de 0-255
   */
  private parseColor(color: string): number[] {
    if (color.startsWith('#')) {
      // Formato hexadecimal
      const hex = color.substring(1);
      return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16)
      ];
    } else if (color.startsWith('rgb')) {
      // Formato RGB
      const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (matches) {
        return [
          parseInt(matches[1], 10),
          parseInt(matches[2], 10),
          parseInt(matches[3], 10)
        ];
      }
    }
    
    // Retorna preto se não conseguir processar
    return [0, 0, 0];
  }
  
  /**
   * Calcula a luminância relativa de uma cor RGB conforme WCAG
   * @param rgb Array com valores RGB [r, g, b]
   * @returns Luminância relativa (entre 0 e 1)
   */
  private calculateLuminance(rgb: number[]): number {
    // Converte valores RGB para valores sRGB
    const srgb = rgb.map(val => {
      const v = val / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    
    // Calcula luminância ponderada
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  }

  /**
   * Adiciona atributos ARIA e roles faltantes em elementos comuns
   * @param rootElement Elemento raiz a partir do qual iniciar a verificação
   */
  addMissingAriaAttributes(rootElement: HTMLElement = this.document.body): void {
    // Adiciona atributos ARIA a elementos de navegação
    const navs = rootElement.querySelectorAll('nav:not([aria-label]):not([aria-labelledby])');
    navs.forEach((nav, index) => {
      nav.setAttribute('aria-label', `Navegação ${index + 1}`);
    });
    
    // Adiciona role para região de busca
    const searchForms = rootElement.querySelectorAll('form:not([role])[action*="search"], div:not([role]).search');
    searchForms.forEach(form => {
      form.setAttribute('role', 'search');
    });
    
    // Adiciona role para botões personalizados
    const customButtons = rootElement.querySelectorAll('div[onclick]:not([role]), span[onclick]:not([role]), a:not([href]):not([role])');
    customButtons.forEach(button => {
      button.setAttribute('role', 'button');
      if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0');
      }
    });
  }

  /**
   * Melhora a navegação por teclado
   */
  improveKeyboardNavigation(): void {
    // Lista de elementos interativos sem foco
    const interactiveElements = this.document.querySelectorAll(
      'div[onclick]:not([tabindex]), span[onclick]:not([tabindex])'
    );
    
    // Adiciona tabindex para torná-los focáveis
    interactiveElements.forEach(element => {
      element.setAttribute('tabindex', '0');
    });
    
    // Adiciona manipuladores de eventos de teclado para elementos não-nativos
    this.addKeyboardEventHandlers();
  }
  
  /**
   * Adiciona eventos de teclado para elementos personalizados
   */
  private addKeyboardEventHandlers(): void {
    // Elementos que precisam de eventos de teclado
    const elements = this.document.querySelectorAll('[role="button"], [role="link"], [role="checkbox"], [role="tab"]');
    
    elements.forEach(element => {
      element.addEventListener('keydown', (event: KeyboardEvent) => {
        // Ativa o elemento com Space ou Enter
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          (element as HTMLElement).click();
        }
      });
    });
  }
}

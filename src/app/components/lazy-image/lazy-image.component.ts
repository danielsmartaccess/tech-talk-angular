import { Component, Input, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lazy-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lazy-image-container" [ngStyle]="{ 'padding-top': aspectRatio + '%' }">
      <!-- Placeholder/Skeleton -->
      <div 
        class="image-placeholder"
        *ngIf="!loaded"
        [ngStyle]="{ 'background-color': placeholderColor }"
      ></div>
      
      <!-- Real Image (renderizada apenas quando estiver próxima da viewport) -->
      <img 
        [src]="loaded ? src : ''" 
        [alt]="alt" 
        [title]="title || alt"
        (load)="onImageLoad()"
        [ngClass]="{ 'loaded': loaded }"
        [width]="width"
        [height]="height"
        [attr.fetchpriority]="priority"
        [attr.loading]="eager ? 'eager' : 'lazy'"
        [attr.decoding]="decoding"
        [attr.srcset]="srcset"
        [attr.sizes]="sizes"
        [attr.importance]="eager ? 'high' : 'auto'"
        [attr.referrerpolicy]="referrerPolicy || null"
      />
    </div>
  `,
  styles: `
    .lazy-image-container {
      position: relative;
      width: 100%;
      overflow: hidden;
      background-color: #f0f0f0;
    }
    
    .image-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      transition: opacity 0.3s ease;
    }
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    img.loaded {
      opacity: 1;
    }
  `
})
export class LazyImageComponent implements AfterViewInit, OnDestroy {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() title: string = '';
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() aspectRatio: number = 56.25; // 16:9 por padrão
  @Input() placeholderColor: string = '#f0f0f0';
  @Input() eager: boolean = false; // Se true, carrega imediatamente
  @Input() priority: 'high' | 'low' | 'auto' = 'auto';
  @Input() decoding: 'async' | 'sync' | 'auto' = 'async';
  @Input() srcset: string = '';
  @Input() sizes: string = '';
  @Input() referrerPolicy?: string;

  loaded: boolean = false;
  private observer: IntersectionObserver | null = null;
  private isIntersecting: boolean = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Se a imagem é prioritária (eager), carregue-a imediatamente
    if (this.eager) {
      this.loadImage();
      return;
    }

    // Caso contrário, use Intersection Observer para carregar apenas quando visível
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    // Desconecta o observer quando o componente é destruído
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Configura o Intersection Observer para detectar quando a imagem está próxima da viewport
   */
  private setupIntersectionObserver(): void {
    if (!('IntersectionObserver' in window)) {
      // Fallback para navegadores que não suportam Intersection Observer
      this.loadImage();
      return;
    }

    const options = {
      rootMargin: '200px 0px', // Carrega um pouco antes de entrar na viewport
      threshold: 0.01
    };

    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      
      if (entry.isIntersecting && !this.isIntersecting) {
        this.isIntersecting = true;
        this.loadImage();
        
        // Se já carregou, podemos desconectar o observer
        if (this.loaded && this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }
      }
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  /**
   * Inicia o carregamento da imagem
   */
  private loadImage(): void {
    // A imagem será carregada quando o atributo 'src' for definido no template
    // Não precisamos fazer nada aqui porque o binding já cuidará disso
    if (this.loaded) return;
    
    // Pré-carrega a imagem em segundo plano para calcular dimensões
    if (this.src) {
      const img = new Image();
      img.src = this.src;
    }
  }

  /**
   * Manipulador de evento quando a imagem termina de carregar
   */
  onImageLoad(): void {
    this.loaded = true;
  }
}

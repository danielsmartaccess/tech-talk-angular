import { Component, inject, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SeoService } from './services/seo.service';
import { SchemaService } from './services/schema.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Go Tech Talk | Tecnologia para a Melhor Idade';
  
  private seoService = inject(SeoService);
  private schemaService = inject(SchemaService);
  private elementRef = inject(ElementRef);
    ngOnInit(): void {
    console.log('AppComponent initialized');
    // Configurações padrão de SEO que serão aplicadas a todas as páginas
    // (podem ser sobrescritas por componentes específicos)
    this.seoService.updateAll({
      title: this.title,
      description: 'A Go Tech Talk capacita pessoas 55+ a dominar tecnologias como WhatsApp, e-mail e videochamadas com aulas personalizadas, conteúdo simplificado e suporte dedicado.',
      keywords: 'tecnologia para idosos, cursos para melhor idade, aulas de tecnologia, aprender whatsapp, inclusão digital',
      url: 'https://gotectalk.com.br',
      image: 'https://gotectalk.com.br/assets/images/go.avif'
    });
    
    // Adicionar dados estruturados globais para a organização
    this.addOrganizationJsonLd();
  }
  
  ngAfterViewInit(): void {
    // Adicionar microdados schema.org para elementos HTML
    this.addSchemaOrgMicrodata();
  }
  
  /**
   * Adiciona JSON-LD para a organização Go Tech Talk
   * Este schema será adicionado a todas as páginas
   */
  private addOrganizationJsonLd(): void {
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Go Tech Talk",
      "alternateName": "Go Tech Talk - Tecnologia para a Melhor Idade",
      "url": "https://gotechtalkt.com.br",
      "logo": "https://gotechtalkt.com.br/assets/images/logo.png",
      "sameAs": [
        "https://facebook.com/gotechtalk",
        "https://instagram.com/gotechtalk",
        "https://youtube.com/gotechtalk"
      ],
      "description": "A Go Tech Talk capacita pessoas 55+ a dominar tecnologias como WhatsApp, e-mail e videochamadas com aulas personalizadas, conteúdo simplificado e suporte dedicado.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Paulista, 1000, Sala 301",
        "addressLocality": "São Paulo",
        "addressRegion": "SP",
        "postalCode": "01310-100",
        "addressCountry": "BR"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+55-11-4567-8900",
          "contactType": "customer service",
          "areaServed": "BR",
          "availableLanguage": ["Portuguese"]
        }
      ],
      "slogan": "Tecnologia simplificada para a melhor idade",
      "knowsAbout": [
        "Tecnologia para idosos",
        "WhatsApp",
        "E-mail",
        "Videochamadas",
        "Inclusão digital",
        "Microlearning",
        "Tecnologia para melhor idade"
      ]
    };
    
    this.seoService.addJsonLd(organizationSchema);
  }
  
  /**
   * Adiciona microdados schema.org aos elementos HTML
   * Utilizando o SchemaService para aplicar os dados estruturados
   */
  private addSchemaOrgMicrodata(): void {
    // Encontrar o elemento footer
    const footerElement = this.elementRef.nativeElement.querySelector('app-footer footer');
    
    if (footerElement) {
      // Aplicar schema Organization ao footer
      this.schemaService.createOrganizationSchema(footerElement, {
        name: "Go Tech Talk",
        description: "Tecnologia simplificada para a melhor idade",
        url: "https://gotechtalkt.com.br",
        logo: "https://gotechtalkt.com.br/assets/images/logo.png",
        telephone: "+55-11-4567-8900",
        email: "contato@gotechtalkt.com.br",
        address: {
          street: "Av. Paulista, 1000, Sala 301",
          locality: "São Paulo",
          region: "SP",
          postalCode: "01310-100",
          country: "Brasil"
        },
        sameAs: [
          "https://facebook.com/gotechtalk",
          "https://instagram.com/gotechtalk",
          "https://youtube.com/gotechtalk"
        ]
      });
    }
  }
}

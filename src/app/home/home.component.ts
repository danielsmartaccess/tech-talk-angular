import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; background: #f0f0f0; margin: 20px;">
      <h1>🎉 HOME COMPONENT FUNCIONANDO!</h1>
      <p>Se você está vendo isso, o Angular e o routing estão funcionando corretamente.</p>
      <p>Data atual: 28 de maio de 2025</p>
      <ul>
        <li>✅ Angular compilando</li>
        <li>✅ Servidor rodando na porta 4200</li>
        <li>✅ HomeComponent carregando</li>
        <li>✅ Routing funcionando</li>
      </ul>
    </div>
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private seoService = inject(SeoService);
  ngOnInit(): void {
    console.log('HomeComponent initialized');
    // Configura metadados SEO específicos para a página inicial
    this.seoService.updateAll({
      title: 'Go Tech Talk | Tecnologia para a Melhor Idade de forma Simples e Intuitiva',
      description: 'A Go Tech Talk capacita pessoas 55+ a dominar tecnologias como WhatsApp, e-mail e videochamadas com aulas personalizadas, conteúdo simplificado e suporte dedicado.',
      keywords: 'tecnologia para idosos, inclusão digital, ensino de tecnologia para terceira idade, cursos de WhatsApp, aulas para melhor idade',
      url: 'https://gotectalk.com.br',
      image: 'https://gotectalk.com.br/assets/images/go.avif',
      type: 'website'
    });

    // Adiciona schema JSON-LD específico para a página inicial
    this.seoService.addJsonLd({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Go Tech Talk",
      "url": "https://gotectalk.com.br",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://gotectalk.com.br/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "description": "Centro educacional especializado em ensino de tecnologia para pessoas com 55 anos ou mais, com foco em inclusão digital e independência tecnológica."
    });
  }

  ngOnDestroy(): void {
    // Remove o JSON-LD dinâmico ao sair da página
    this.seoService.removeJsonLd();
  }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MicrolearningComponent } from '../components/microlearning/microlearning.component';
import { CommonModule } from '@angular/common';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MicrolearningComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private seoService = inject(SeoService);

  ngOnInit(): void {
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

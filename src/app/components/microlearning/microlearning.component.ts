import { Component, OnInit, OnDestroy, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SchemaService } from '../../services/schema.service';
import { SeoService } from '../../services/seo.service';

interface MicrolearningModule {
  id: number;
  title: string;
  description: string;
  level: string;
  topics: string[];
  icon: string;
  featured?: boolean;
  url: string;
  imageUrl?: string;
  duration: string; // Formato ISO 8601 (PT5M = 5 minutos)
  provider: string;
}

@Component({
  selector: 'app-microlearning',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './microlearning.component.html',
  styleUrls: ['./microlearning.component.scss']
})
export class MicrolearningComponent implements OnInit, OnDestroy {
  private seoService = inject(SeoService);
  private schemaService = inject(SchemaService);
  private elementRef = inject(ElementRef);
  
  microlearningModules: MicrolearningModule[] = [
    {
      id: 1,
      title: 'Como saber se uma mensagem no WhatsApp é confiável?',
      description: 'Aprenda a identificar mensagens suspeitas com estas dicas úteis para seu dia a dia.',
      level: 'Básico',
      topics: [
        'Verifique o remetente antes de abrir links',
        'Desconfie de ofertas muito vantajosas',
        'Observe erros de português e formatação estranha',
        'Não compartilhe códigos de verificação recebidos por SMS'
      ],
      icon: 'fab fa-whatsapp',
      url: '/microlearning/whatsapp-seguranca',
      imageUrl: 'assets/images/microlearning/whatsapp-seguranca.jpg',
      duration: 'PT5M',
      provider: 'Go Tech Talk'
    },
    {
      id: 2,
      title: 'Como silenciar grupos barulhentos sem sair deles?',
      description: 'Mantenha a paz sem perder o contato com seus grupos no WhatsApp.',
      level: 'Intermediário',
      topics: [
        'Aprenda a silenciar notificações por 8 horas, 1 semana ou sempre',
        'Configure quais grupos aparecem na tela inicial',
        'Saiba como arquivar conversas sem excluí-las',
        'Organize seus grupos com etiquetas personalizadas'
      ],
      icon: 'fab fa-whatsapp',
      url: '/microlearning/whatsapp-grupos',
      imageUrl: 'assets/images/microlearning/whatsapp-grupos.jpg',
      duration: 'PT5M',
      provider: 'Go Tech Talk'
    },
    {
      id: 3,
      title: 'O que é ChatGPT e como ele pode ajudar no seu dia a dia?',
      description: 'Descubra como a inteligência artificial pode facilitar sua vida com exemplos práticos.',
      level: 'Destaque',
      featured: true,
      topics: [
        'Entenda o que é o ChatGPT em linguagem simples',
        'Aprenda a fazer perguntas que geram respostas úteis',
        'Use o ChatGPT para criar receitas baseadas nos ingredientes que você tem em casa',
        'Peça sugestões de atividades para fazer com os netos'
      ],
      icon: 'fas fa-robot',
      url: '/microlearning/chatgpt-introducao',
      imageUrl: 'assets/images/microlearning/chatgpt-intro.jpg',
      duration: 'PT6M',
      provider: 'Go Tech Talk'
    },
    {
      id: 4,
      title: 'Como fazer videochamadas em grupo no WhatsApp?',
      description: 'Conecte-se com toda a família mesmo à distância com videochamadas simples.',
      level: 'Prático',
      topics: [
        'Configure sua câmera e microfone para melhor qualidade',
        'Inicie uma videochamada com até 8 pessoas',
        'Aprenda a compartilhar sua tela durante a chamada',
        'Dicas para economizar dados durante videochamadas'
      ],
      icon: 'fab fa-whatsapp',
      url: '/microlearning/whatsapp-videochamadas',
      imageUrl: 'assets/images/microlearning/whatsapp-videochamadas.jpg',
      duration: 'PT5M',
      provider: 'Go Tech Talk'
    },
    {
      id: 5,
      title: 'Como usar o ChatGPT para planejar sua próxima viagem?',
      description: 'Planejamento de viagens sem complicação com ajuda da inteligência artificial.',
      level: 'Avançado',
      topics: [
        'Peça roteiros personalizados baseados em suas preferências e limitações',
        'Obtenha sugestões de atividades adaptadas para a melhor idade',
        'Descubra como pedir dicas de acessibilidade para seus destinos',
        'Crie listas de bagagem personalizadas para qualquer destino'
      ],
      icon: 'fas fa-robot',
      url: '/microlearning/chatgpt-viagens',
      imageUrl: 'assets/images/microlearning/chatgpt-viagens.jpg',
      duration: 'PT7M',
      provider: 'Go Tech Talk'
    }
  ];
  
  ngOnInit(): void {
    // Configurar metadados de SEO para a página de microlearning
    this.seoService.updateAll({
      title: 'Microlearning Go Tech Talk | Aprenda Tecnologia em 5 Minutos',
      description: 'Módulos rápidos e práticos para dominar ferramentas digitais essenciais para a melhor idade. Aprenda WhatsApp, ChatGPT e mais em apenas 5 minutos por dia!',
      keywords: 'microlearning, whatsapp, chatgpt, tecnologia melhor idade, cursos rápidos, aprendizado digital, 60+',
      url: window.location.href,
      type: 'website',
      image: 'https://gotechtalkt.com.br/assets/images/microlearning-banner.jpg'
    });
    
    // Adicionar JSON-LD para a página (Course List)
    this.seoService.addJsonLd({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": this.microlearningModules.map((course, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Course",
          "name": course.title,
          "description": course.description,
          "provider": {
            "@type": "Organization",
            "name": course.provider,
            "sameAs": "https://gotechtalkt.com.br"
          },
          "url": `https://gotechtalkt.com.br${course.url}`,
          "image": course.imageUrl ? `https://gotechtalkt.com.br${course.imageUrl}` : undefined,
          "timeRequired": course.duration
        }
      }))
    });
    
    // Adicionar dados estruturados Course para cada card usando microdata
    setTimeout(() => this.addStructuredDataToCourseCards(), 0);
  }
  
  ngOnDestroy(): void {
    // Remover o JSON-LD quando sair da página
    this.seoService.removeJsonLd();
  }
  
  /**
   * Adiciona dados estruturados microdata aos cards de curso
   * Implementação utilizando o SchemaService
   */
  addStructuredDataToCourseCards(): void {
    const courseCards = this.elementRef.nativeElement.querySelectorAll('.microlearning-card');
    
    if (courseCards && courseCards.length > 0) {
      courseCards.forEach((card: HTMLElement, index: number) => {
        const course = this.microlearningModules[index];
        if (!course) return;
        
        this.schemaService.createCourseSchema(card, {
          name: course.title,
          description: course.description,
          provider: course.provider,
          imageUrl: course.imageUrl ? `https://gotechtalkt.com.br${course.imageUrl}` : undefined,
          url: `https://gotechtalkt.com.br${course.url}`,
          timeRequired: course.duration,
          contentLevel: this.mapLevelToSchemaLevel(course.level)
        });
      });
    }
    
    // Adicionar Schema.org para a seção completa de microlearning
    const section = this.elementRef.nativeElement.querySelector('.microlearning-section');
    if (section) {
      this.schemaService.applySchema(section, 'EducationEvent');
      
      const sectionTitle = section.querySelector('.section-title');
      if (sectionTitle) {
        this.schemaService.applyProperty(sectionTitle, 'name');
      }
      
      const sectionIntro = section.querySelector('.section-intro');
      if (sectionIntro) {
        this.schemaService.applyProperty(sectionIntro, 'description');
      }
    }
  }
  
  /**
   * Mapeia os níveis internos para os níveis Schema.org
   */
  private mapLevelToSchemaLevel(level: string): 'Beginner' | 'Intermediate' | 'Advanced' {
    switch (level.toLowerCase()) {
      case 'básico':
        return 'Beginner';
      case 'intermediário':
      case 'prático':
        return 'Intermediate';
      case 'avançado':
      case 'destaque':
        return 'Advanced';
      default:
        return 'Beginner';
    }
  }
}

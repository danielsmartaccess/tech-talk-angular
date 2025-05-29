import { Component, OnInit, OnDestroy, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SchemaService } from '../../services/schema.service';
import { SeoService } from '../../services/seo.service';

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {
  private seoService = inject(SeoService);
  private schemaService = inject(SchemaService);
  private elementRef = inject(ElementRef);
  
  activeCategory: string = 'geral';
  
  categories = [
    { id: 'geral', name: 'Geral' },
    { id: 'whatsapp', name: 'WhatsApp' },
    { id: 'cursos', name: 'Cursos' },
    { id: 'eventos', name: 'Eventos' },
    { id: 'pagamentos', name: 'Pagamentos' }
  ];
  
  // Método para obter o nome da categoria ativa
  getCategoryName(): string {
    const category = this.categories.find(cat => cat.id === this.activeCategory);
    return category ? category.name : '';
  }
  
  faqItems: FaqItem[] = [
    {
      question: 'O que é a Go Tech Talk?',
      answer: 'A Go Tech Talk é uma comunidade de aprendizado focada em ensinar tecnologia para o público 55+, com foco em acessibilidade e linguagem simples para facilitar o uso de ferramentas digitais no dia a dia.',
      category: 'geral'
    },
    {
      question: 'Preciso ter computador para acessar os cursos?',
      answer: 'Não necessariamente. Muitos de nossos cursos e microlearnings podem ser acessados pelo celular ou tablet. Temos conteúdos específicos para cada dispositivo.',
      category: 'geral'
    },
    {
      question: 'Como faço para receber ajuda se tiver dúvidas durante um curso?',
      answer: 'Temos um suporte dedicado por WhatsApp e email. Além disso, realizamos encontros semanais ao vivo para esclarecer dúvidas dos alunos. Nos cursos ao vivo, há monitores para dar suporte individual.',
      category: 'cursos'
    },
    {
      question: 'Os cursos têm certificado?',
      answer: 'Sim, todos os nossos cursos completos possuem certificados digitais que podem ser baixados ou compartilhados diretamente nas redes sociais.',
      category: 'cursos'
    },
    {
      question: 'Como faço para silenciar um grupo no WhatsApp?',
      answer: 'Para silenciar um grupo no WhatsApp, toque e segure no nome do grupo, selecione a opção "Silenciar notificações" e escolha por quanto tempo deseja silenciar: 8 horas, 1 semana ou sempre.',
      category: 'whatsapp'
    },
    {
      question: 'É possível arquivar conversas no WhatsApp sem apagá-las?',
      answer: 'Sim, para arquivar uma conversa sem excluí-la, deslize a conversa para a direita na tela principal do WhatsApp e toque na opção "Arquivar". Para ver as conversas arquivadas, role para o final da lista de conversas e toque em "Arquivadas".',
      category: 'whatsapp'
    },
    {
      question: 'Os eventos da Go Tech Talk são presenciais ou online?',
      answer: 'Realizamos eventos em ambos os formatos. Temos encontros online semanais e eventos presenciais mensais em diversas cidades. Consulte nossa agenda para ver os próximos eventos na sua região.',
      category: 'eventos'
    },
    {
      question: 'Preciso me inscrever com antecedência para participar dos eventos?',
      answer: 'Sim, recomendamos que faça sua inscrição com antecedência, pois nossas vagas são limitadas, especialmente para eventos presenciais. A inscrição pode ser feita pelo site ou pelo nosso aplicativo.',
      category: 'eventos'
    },
    {
      question: 'Quais formas de pagamento são aceitas?',
      answer: 'Aceitamos cartões de crédito, débito, boleto bancário e PIX. Para cursos com mensalidade, também oferecemos a opção de débito automático.',
      category: 'pagamentos'
    },
    {
      question: 'Existe algum desconto para idosos?',
      answer: 'Sim, oferecemos 15% de desconto para pessoas com 60 anos ou mais em todos os nossos cursos e planos. Basta informar sua data de nascimento no cadastro ou apresentar documento que comprove a idade.',
      category: 'pagamentos'
    }
  ];
  
  get filteredFaqs(): FaqItem[] {
    return this.faqItems.filter(item => item.category === this.activeCategory);
  }
  
  ngOnInit(): void {
    this.setupSeo();
    
    // Adicionar JSON-LD para a página de FAQs
    this.addJsonLdSchema();
    
    // Adicionar dados estruturados de microdados após a renderização da view
    setTimeout(() => this.addStructuredDataToFaqs(), 0);
  }
  
  ngOnDestroy(): void {
    this.seoService.removeJsonLd();
  }
  
  /**
   * Configura os metadados de SEO
   */
  setupSeo(): void {
    this.seoService.updateAll({
      title: 'Perguntas Frequentes | Go Tech Talk',
      description: 'Encontre respostas para as dúvidas mais comuns sobre nossos cursos, eventos e como usar tecnologia no dia a dia. Feito especialmente para o público 55+ com linguagem acessível.',
      keywords: 'FAQ, perguntas frequentes, dúvidas, tecnologia para idosos, whatsapp, cursos online',
      url: window.location.href,
      type: 'website'
    });
  }
  
  /**
   * Adiciona JSON-LD para a página de FAQs
   */
  addJsonLdSchema(): void {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": this.faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
    
    this.seoService.addJsonLd(faqSchema);
  }
  
  /**
   * Adiciona dados estruturados microdata às perguntas usando o SchemaService
   */
  addStructuredDataToFaqs(): void {
    const faqSection = this.elementRef.nativeElement.querySelector('.faq-section');
    
    if (faqSection) {
      // Aplicar schema FAQPage à seção principal
      this.schemaService.applySchema(faqSection, 'FAQPage');
      
      // Adicionar schema para cada questão/resposta
      const faqItems = this.elementRef.nativeElement.querySelectorAll('.faq-item');
      if (faqItems && faqItems.length > 0) {
        const questions = this.faqItems.filter(item => item.category === this.activeCategory);
        
        faqItems.forEach((item: HTMLElement, index: number) => {
          const question = questions[index];
          if (!question) return;
          
          // Não usamos createFaqSchema aqui porque queremos aplicar individualmente
          // para elementos visíveis, não com metadados ocultos
          
          // Aplicar schema Question ao item
          this.schemaService.applySchema(item, 'Question');
            // Aplicar property name à pergunta
          const questionElement = item.querySelector('.faq-question') as HTMLElement;
          if (questionElement) {
            this.schemaService.applyProperty(questionElement, 'name');
          }
          
          // Aplicar schema Answer à resposta
          const answerElement = item.querySelector('.faq-answer') as HTMLElement;
          if (answerElement) {
            // Aplicar itemtype e itemprop
            this.schemaService.applySchema(answerElement, 'Answer');
            this.schemaService.applyProperty(answerElement, 'text');
            
            // Também aplicar como acceptedAnswer (relação com a pergunta)
            this.schemaService.applyProperty(answerElement, 'acceptedAnswer');
          }
        });
      }
    }
  }
  
  /**
   * Altera a categoria ativa das FAQs
   */
  changeCategory(category: string): void {
    this.activeCategory = category;
    
    // Re-aplicar os dados estruturados após a mudança de categoria
    setTimeout(() => this.addStructuredDataToFaqs(), 0);
  }
}

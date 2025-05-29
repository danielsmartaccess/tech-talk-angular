import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemaService } from '../../services/schema.service';

@Component({
  selector: 'app-schema-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="schema-test-component">
      <h2>Teste do SchemaService</h2>
      <p>Esta página demonstra como o SchemaService aplica dados estruturados no site.</p>

      <section class="test-section">
        <h3>1. Teste de FAQPage</h3>
        <div #faqContainer class="test-container">
          <div class="faq-item">
            <h4 class="faq-question">O que é Schema.org?</h4>
            <div class="faq-answer">
              <p>Schema.org é um vocabulário estruturado de dados criado colaborativamente para melhorar a forma como os mecanismos de busca interpretam e exibem conteúdo nas páginas de resultados.</p>
            </div>
          </div>
          <div class="faq-item">
            <h4 class="faq-question">Qual a importância dos dados estruturados para SEO?</h4>
            <div class="faq-answer">
              <p>Dados estruturados ajudam os mecanismos de busca a entender melhor o conteúdo das páginas, o que pode resultar em rich snippets (resultados enriquecidos) nas SERPs, maior visibilidade e potencialmente melhor CTR.</p>
            </div>
          </div>
        </div>
        <button (click)="applyFaqSchema()">Aplicar Schema FAQPage</button>
      </section>

      <section class="test-section">
        <h3>2. Teste de Course</h3>
        <div #courseContainer class="test-container">
          <div class="course-card">
            <h4 class="course-name">WhatsApp para Iniciantes</h4>
            <p class="course-description">Aprenda a utilizar o WhatsApp do zero, com foco em recursos básicos para comunicação diária.</p>
            <div class="course-meta">
              <span class="course-provider">Go Tech Talk</span>
              <span class="course-price">R$ 79,90</span>
            </div>
          </div>
        </div>
        <button (click)="applyCourseSchema()">Aplicar Schema Course</button>
      </section>

      <section class="test-section">
        <h3>3. Teste de Organization</h3>
        <div #orgContainer class="test-container">
          <div class="organization-card">
            <h4 class="org-name">Go Tech Talk</h4>
            <p class="org-description">Empresa especializada em ensino de tecnologia para o público 55+.</p>
            <address class="org-address">
              Av. Paulista, 1000, São Paulo/SP
            </address>
          </div>
        </div>
        <button (click)="applyOrganizationSchema()">Aplicar Schema Organization</button>
      </section>

      <section class="test-section">
        <h3>4. Teste de BreadcrumbList</h3>
        <div #breadcrumbContainer class="test-container">
          <nav class="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li><a href="/courses">Cursos</a></li>
              <li><a href="/courses/tech">Tecnologia</a></li>
              <li>WhatsApp</li>
            </ol>
          </nav>
        </div>
        <button (click)="applyBreadcrumbSchema()">Aplicar Schema BreadcrumbList</button>
      </section>

      <section class="test-section">
        <h3>5. Teste de Review</h3>
        <div #reviewContainer class="test-container">
          <div class="review-card">
            <h4 class="review-title">Excelente curso!</h4>
            <div class="review-rating">5 estrelas</div>
            <p class="review-text">O curso me ajudou muito a usar o WhatsApp para falar com meus netos. Recomendo!</p>
            <div class="review-author">Maria Silva, 68 anos</div>
          </div>
        </div>
        <button (click)="applyReviewSchema()">Aplicar Schema Review</button>
      </section>

      <div class="results-section">
        <h3>Como verificar os resultados?</h3>
        <ol>
          <li>Clique nos botões acima para aplicar os diferentes tipos de schema</li>
          <li>Abra o "Inspecionar elemento" do navegador (clique com botão direito -> Inspecionar)</li>
          <li>Observe os atributos <code>itemscope</code>, <code>itemtype</code> e <code>itemprop</code> adicionados ao HTML</li>
          <li>Use ferramentas como <a href="https://search.google.com/test/rich-results" target="_blank">Google Rich Results Test</a> para validar</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .schema-test-component {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .test-section {
      border: 1px solid #ddd;
      margin: 20px 0;
      padding: 15px;
      border-radius: 5px;
      background-color: #f9f9f9;
    }
    
    .test-container {
      border: 1px dashed #aaa;
      padding: 10px;
      margin: 10px 0;
      background-color: white;
    }
    
    button {
      background-color: #4285f4;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }
    
    button:hover {
      background-color: #3367d6;
    }
    
    .results-section {
      margin-top: 30px;
      padding: 15px;
      background-color: #e8f0fe;
      border-radius: 5px;
    }
    
    code {
      background-color: #f0f0f0;
      padding: 2px 5px;
      border-radius: 3px;
      font-family: monospace;
    }
  `]
})
export class SchemaTestComponent implements OnInit {
  private schemaService = inject(SchemaService);
  
  ngOnInit(): void {
    console.log('Schema Test Component iniciado');
  }
  
  applyFaqSchema(): void {
    const faqContainer = document.querySelector('.faq-item')?.parentElement as HTMLElement;
    if (faqContainer) {
      // Aplicar schema FAQPage ao container
      this.schemaService.applySchema(faqContainer, 'FAQPage');
      
      // Aplicar schema Question às perguntas
      const faqItems = faqContainer.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        // Aplicar schema Question
        this.schemaService.applySchema(item as HTMLElement, 'Question');
        
        // Aplicar name à pergunta
        const questionElement = item.querySelector('.faq-question') as HTMLElement;
        if (questionElement) {
          this.schemaService.applyProperty(questionElement, 'name');
        }
        
        // Aplicar acceptedAnswer à resposta
        const answerElement = item.querySelector('.faq-answer') as HTMLElement;
        if (answerElement) {          this.schemaService.applySchema(answerElement, 'Answer');
          this.schemaService.applyProperty(answerElement, 'text');
          this.schemaService.applyProperty(answerElement, 'acceptedAnswer');
        }
      });
      
      alert('Schema FAQPage aplicado! Verifique o código HTML no inspetor do navegador.');
    }
  }
  
  applyCourseSchema(): void {
    const courseContainer = document.querySelector('.course-card') as HTMLElement;
    if (courseContainer) {
      // Aplicar schema Course
      this.schemaService.applySchema(courseContainer, 'Course');
      
      // Aplicar propriedades
      const nameElement = courseContainer.querySelector('.course-name') as HTMLElement;
      if (nameElement) {
        this.schemaService.applyProperty(nameElement, 'name');
      }
      
      const descElement = courseContainer.querySelector('.course-description') as HTMLElement;
      if (descElement) {
        this.schemaService.applyProperty(descElement, 'description');
      }
      
      const providerElement = courseContainer.querySelector('.course-provider') as HTMLElement;
      if (providerElement) {
        this.schemaService.applySchema(providerElement, 'Organization');
        this.schemaService.applyProperty(providerElement, 'provider');
      }
      
      const priceElement = courseContainer.querySelector('.course-price') as HTMLElement;
      if (priceElement) {
        this.schemaService.applyProperty(priceElement, 'offers');
      }
      
      alert('Schema Course aplicado! Verifique o código HTML no inspetor do navegador.');
    }
  }
  
  applyOrganizationSchema(): void {
    const orgContainer = document.querySelector('.organization-card') as HTMLElement;
    if (orgContainer) {
      // Aplicar schema Organization
      this.schemaService.applySchema(orgContainer, 'Organization');
      
      // Aplicar propriedades
      const nameElement = orgContainer.querySelector('.org-name') as HTMLElement;
      if (nameElement) {
        this.schemaService.applyProperty(nameElement, 'name');
      }
      
      const descElement = orgContainer.querySelector('.org-description') as HTMLElement;
      if (descElement) {
        this.schemaService.applyProperty(descElement, 'description');
      }
      
      const addressElement = orgContainer.querySelector('.org-address') as HTMLElement;
      if (addressElement) {
        this.schemaService.applySchema(addressElement, 'PostalAddress');
        this.schemaService.applyProperty(addressElement, 'address');
      }
      
      alert('Schema Organization aplicado! Verifique o código HTML no inspetor do navegador.');
    }
  }
  
  applyBreadcrumbSchema(): void {
    const breadcrumbContainer = document.querySelector('.breadcrumbs') as HTMLElement;
    if (breadcrumbContainer) {
      // Aplicar schema BreadcrumbList
      this.schemaService.applySchema(breadcrumbContainer, 'BreadcrumbList');
      
      // Aplicar propriedades aos itens
      const items = breadcrumbContainer.querySelectorAll('ol > li');
      items.forEach((item, index) => {
        // Aplicar schema ListItem
        this.schemaService.applySchema(item as HTMLElement, 'ListItem');
          // Aplicar position como um meta elemento
        const positionMeta = document.createElement('meta');
        positionMeta.content = (index + 1).toString();
        this.schemaService.applyProperty(positionMeta, 'position');
        item.appendChild(positionMeta);
        
        // Aplicar item nas tags de link
        const link = item.querySelector('a') as HTMLElement;
        if (link) {
          this.schemaService.applyProperty(link, 'item');
          this.schemaService.applyProperty(link, 'name');
        } else {
          // Para o último item sem link
          this.schemaService.applyProperty(item as HTMLElement, 'name');
        }
      });
      
      alert('Schema BreadcrumbList aplicado! Verifique o código HTML no inspetor do navegador.');
    }
  }
  
  applyReviewSchema(): void {
    const reviewContainer = document.querySelector('.review-card') as HTMLElement;
    if (reviewContainer) {
      // Aplicar schema Review
      this.schemaService.applySchema(reviewContainer, 'Review');
      
      // Aplicar propriedades
      const titleElement = reviewContainer.querySelector('.review-title') as HTMLElement;
      if (titleElement) {
        this.schemaService.applyProperty(titleElement, 'name');
      }
      
      const ratingElement = reviewContainer.querySelector('.review-rating') as HTMLElement;
      if (ratingElement) {
        this.schemaService.applySchema(ratingElement, 'Rating');        this.schemaService.applyProperty(ratingElement, 'reviewRating');
        
        // Adicionar valor de avaliação usando meta
        const ratingMeta = document.createElement('meta');
        ratingMeta.content = '5';
        this.schemaService.applyProperty(ratingMeta, 'ratingValue');
        ratingElement.appendChild(ratingMeta);
      }
      
      const textElement = reviewContainer.querySelector('.review-text') as HTMLElement;
      if (textElement) {
        this.schemaService.applyProperty(textElement, 'reviewBody');
      }
      
      const authorElement = reviewContainer.querySelector('.review-author') as HTMLElement;
      if (authorElement) {
        this.schemaService.applySchema(authorElement, 'Person');
        this.schemaService.applyProperty(authorElement, 'author');
      }
      
      alert('Schema Review aplicado! Verifique o código HTML no inspetor do navegador.');
    }
  }
}

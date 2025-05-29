import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

/**
 * Serviço para gerenciamento de microdados Schema.org
 * Complementa o JSON-LD já implementado no SeoService
 */
@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Aplica atributos itemscope e itemtype a um elemento HTML
   * @param element Elemento HTML alvo
   * @param schemaType Tipo de Schema.org (ex: 'Product', 'Person')
   */
  applySchema(element: HTMLElement, schemaType: string): void {
    if (!element) return;
    
    this.renderer.setAttribute(element, 'itemscope', '');
    this.renderer.setAttribute(element, 'itemtype', `https://schema.org/${schemaType}`);
  }

  /**
   * Aplica um atributo itemprop a um elemento HTML
   * @param element Elemento HTML alvo
   * @param property Nome da propriedade Schema.org
   */
  applyProperty(element: HTMLElement, property: string): void {
    if (!element) return;
    
    this.renderer.setAttribute(element, 'itemprop', property);
  }

  /**
   * Cria metadados Schema.org para uma postagem de blog
   * @param parent Elemento pai onde os metadados serão adicionados
   * @param data Dados da postagem de blog
   */
  createArticleSchema(parent: HTMLElement, data: {
    headline: string;
    datePublished: string;
    dateModified: string;
    author: string;
    description: string;
    imageUrl: string;
    imageWidth?: string;
    imageHeight?: string;
  }): void {
    // Aplicar itemscope e itemtype ao container
    this.applySchema(parent, 'Article');
    
    // Adicionar metadadados ocultos para dados que não estão visíveis no DOM
    const metaContainer = this.renderer.createElement('div');
    this.renderer.setStyle(metaContainer, 'display', 'none');
    
    // Headline (se não estiver já visível no DOM)
    const headline = this.renderer.createElement('meta');
    this.renderer.setAttribute(headline, 'itemprop', 'headline');
    this.renderer.setAttribute(headline, 'content', data.headline);
    this.renderer.appendChild(metaContainer, headline);
    
    // Data de publicação
    const datePublished = this.renderer.createElement('meta');
    this.renderer.setAttribute(datePublished, 'itemprop', 'datePublished');
    this.renderer.setAttribute(datePublished, 'content', data.datePublished);
    this.renderer.appendChild(metaContainer, datePublished);
    
    // Data de modificação
    const dateModified = this.renderer.createElement('meta');
    this.renderer.setAttribute(dateModified, 'itemprop', 'dateModified');
    this.renderer.setAttribute(dateModified, 'content', data.dateModified);
    this.renderer.appendChild(metaContainer, dateModified);
    
    // Autor
    const author = this.renderer.createElement('div');
    this.renderer.setAttribute(author, 'itemprop', 'author');
    this.renderer.setAttribute(author, 'itemscope', '');
    this.renderer.setAttribute(author, 'itemtype', 'https://schema.org/Person');
    
    const authorName = this.renderer.createElement('meta');
    this.renderer.setAttribute(authorName, 'itemprop', 'name');
    this.renderer.setAttribute(authorName, 'content', data.author);
    this.renderer.appendChild(author, authorName);
    this.renderer.appendChild(metaContainer, author);
    
    // Descrição
    const description = this.renderer.createElement('meta');
    this.renderer.setAttribute(description, 'itemprop', 'description');
    this.renderer.setAttribute(description, 'content', data.description);
    this.renderer.appendChild(metaContainer, description);
    
    // Imagem
    const image = this.renderer.createElement('div');
    this.renderer.setAttribute(image, 'itemprop', 'image');
    this.renderer.setAttribute(image, 'itemscope', '');
    this.renderer.setAttribute(image, 'itemtype', 'https://schema.org/ImageObject');
    
    const imageUrl = this.renderer.createElement('meta');
    this.renderer.setAttribute(imageUrl, 'itemprop', 'url');
    this.renderer.setAttribute(imageUrl, 'content', data.imageUrl);
    this.renderer.appendChild(image, imageUrl);
    
    if (data.imageWidth && data.imageHeight) {
      const imageWidth = this.renderer.createElement('meta');
      this.renderer.setAttribute(imageWidth, 'itemprop', 'width');
      this.renderer.setAttribute(imageWidth, 'content', data.imageWidth);
      this.renderer.appendChild(image, imageWidth);
      
      const imageHeight = this.renderer.createElement('meta');
      this.renderer.setAttribute(imageHeight, 'itemprop', 'height');
      this.renderer.setAttribute(imageHeight, 'content', data.imageHeight);
      this.renderer.appendChild(image, imageHeight);
    }
    
    this.renderer.appendChild(metaContainer, image);
    
    // Adicionar o container de metadados ao elemento pai
    this.renderer.appendChild(parent, metaContainer);
  }

  /**
   * Cria metadados Schema.org para um evento
   * @param parent Elemento pai onde os metadados serão adicionados
   * @param data Dados do evento
   */
  createEventSchema(parent: HTMLElement, data: {
    name: string;
    startDate: string;
    endDate?: string;
    location: string;
    description: string;
    imageUrl?: string;
    organizer?: string;
    price?: string;
    currency?: string;
  }): void {
    // Aplicar itemscope e itemtype ao container
    this.applySchema(parent, 'Event');
    
    // Adicionar metadadados ocultos para dados que não estão visíveis no DOM
    const metaContainer = this.renderer.createElement('div');
    this.renderer.setStyle(metaContainer, 'display', 'none');
    
    // Nome do evento
    const name = this.renderer.createElement('meta');
    this.renderer.setAttribute(name, 'itemprop', 'name');
    this.renderer.setAttribute(name, 'content', data.name);
    this.renderer.appendChild(metaContainer, name);
    
    // Data de início
    const startDate = this.renderer.createElement('meta');
    this.renderer.setAttribute(startDate, 'itemprop', 'startDate');
    this.renderer.setAttribute(startDate, 'content', data.startDate);
    this.renderer.appendChild(metaContainer, startDate);
    
    // Data de término (opcional)
    if (data.endDate) {
      const endDate = this.renderer.createElement('meta');
      this.renderer.setAttribute(endDate, 'itemprop', 'endDate');
      this.renderer.setAttribute(endDate, 'content', data.endDate);
      this.renderer.appendChild(metaContainer, endDate);
    }
    
    // Local do evento
    const location = this.renderer.createElement('div');
    this.renderer.setAttribute(location, 'itemprop', 'location');
    this.renderer.setAttribute(location, 'itemscope', '');
    this.renderer.setAttribute(location, 'itemtype', 'https://schema.org/Place');
    
    const locationName = this.renderer.createElement('meta');
    this.renderer.setAttribute(locationName, 'itemprop', 'name');
    this.renderer.setAttribute(locationName, 'content', data.location);
    this.renderer.appendChild(location, locationName);
    this.renderer.appendChild(metaContainer, location);
    
    // Descrição
    const description = this.renderer.createElement('meta');
    this.renderer.setAttribute(description, 'itemprop', 'description');
    this.renderer.setAttribute(description, 'content', data.description);
    this.renderer.appendChild(metaContainer, description);
    
    // Imagem (opcional)
    if (data.imageUrl) {
      const image = this.renderer.createElement('meta');
      this.renderer.setAttribute(image, 'itemprop', 'image');
      this.renderer.setAttribute(image, 'content', data.imageUrl);
      this.renderer.appendChild(metaContainer, image);
    }
    
    // Organizador (opcional)
    if (data.organizer) {
      const organizer = this.renderer.createElement('div');
      this.renderer.setAttribute(organizer, 'itemprop', 'organizer');
      this.renderer.setAttribute(organizer, 'itemscope', '');
      this.renderer.setAttribute(organizer, 'itemtype', 'https://schema.org/Organization');
      
      const organizerName = this.renderer.createElement('meta');
      this.renderer.setAttribute(organizerName, 'itemprop', 'name');
      this.renderer.setAttribute(organizerName, 'content', data.organizer);
      this.renderer.appendChild(organizer, organizerName);
      this.renderer.appendChild(metaContainer, organizer);
    }
    
    // Preço (opcional)
    if (data.price && data.currency) {
      const offers = this.renderer.createElement('div');
      this.renderer.setAttribute(offers, 'itemprop', 'offers');
      this.renderer.setAttribute(offers, 'itemscope', '');
      this.renderer.setAttribute(offers, 'itemtype', 'https://schema.org/Offer');
      
      const price = this.renderer.createElement('meta');
      this.renderer.setAttribute(price, 'itemprop', 'price');
      this.renderer.setAttribute(price, 'content', data.price);
      this.renderer.appendChild(offers, price);
      
      const currency = this.renderer.createElement('meta');
      this.renderer.setAttribute(currency, 'itemprop', 'priceCurrency');
      this.renderer.setAttribute(currency, 'content', data.currency);
      this.renderer.appendChild(offers, currency);
      
      this.renderer.appendChild(metaContainer, offers);
    }
    
    // Adicionar o container de metadados ao elemento pai
    this.renderer.appendChild(parent, metaContainer);
  }

  /**
   * Cria metadados Schema.org para um produto
   * @param parent Elemento pai onde os metadados serão adicionados
   * @param data Dados do produto
   */
  createProductSchema(parent: HTMLElement, data: {
    name: string;
    description: string;
    imageUrl: string;
    price: string;
    currency: string;
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    ratingValue?: string;
    reviewCount?: string;
    brand?: string;
  }): void {
    // Aplicar itemscope e itemtype ao container
    this.applySchema(parent, 'Product');
    
    // Adicionar metadadados ocultos para dados que não estão visíveis no DOM
    const metaContainer = this.renderer.createElement('div');
    this.renderer.setStyle(metaContainer, 'display', 'none');
    
    // Nome do produto
    const name = this.renderer.createElement('meta');
    this.renderer.setAttribute(name, 'itemprop', 'name');
    this.renderer.setAttribute(name, 'content', data.name);
    this.renderer.appendChild(metaContainer, name);
    
    // Descrição
    const description = this.renderer.createElement('meta');
    this.renderer.setAttribute(description, 'itemprop', 'description');
    this.renderer.setAttribute(description, 'content', data.description);
    this.renderer.appendChild(metaContainer, description);
    
    // Imagem
    const image = this.renderer.createElement('meta');
    this.renderer.setAttribute(image, 'itemprop', 'image');
    this.renderer.setAttribute(image, 'content', data.imageUrl);
    this.renderer.appendChild(metaContainer, image);
    
    // Oferta
    const offers = this.renderer.createElement('div');
    this.renderer.setAttribute(offers, 'itemprop', 'offers');
    this.renderer.setAttribute(offers, 'itemscope', '');
    this.renderer.setAttribute(offers, 'itemtype', 'https://schema.org/Offer');
    
    const price = this.renderer.createElement('meta');
    this.renderer.setAttribute(price, 'itemprop', 'price');
    this.renderer.setAttribute(price, 'content', data.price);
    this.renderer.appendChild(offers, price);
    
    const currency = this.renderer.createElement('meta');
    this.renderer.setAttribute(currency, 'itemprop', 'priceCurrency');
    this.renderer.setAttribute(currency, 'content', data.currency);
    this.renderer.appendChild(offers, currency);
    
    const availability = this.renderer.createElement('meta');
    this.renderer.setAttribute(availability, 'itemprop', 'availability');
    this.renderer.setAttribute(availability, 'content', `https://schema.org/${data.availability}`);
    this.renderer.appendChild(offers, availability);
    
    this.renderer.appendChild(metaContainer, offers);
    
    // Avaliações (opcional)
    if (data.ratingValue && data.reviewCount) {
      const aggregateRating = this.renderer.createElement('div');
      this.renderer.setAttribute(aggregateRating, 'itemprop', 'aggregateRating');
      this.renderer.setAttribute(aggregateRating, 'itemscope', '');
      this.renderer.setAttribute(aggregateRating, 'itemtype', 'https://schema.org/AggregateRating');
      
      const ratingValue = this.renderer.createElement('meta');
      this.renderer.setAttribute(ratingValue, 'itemprop', 'ratingValue');
      this.renderer.setAttribute(ratingValue, 'content', data.ratingValue);
      this.renderer.appendChild(aggregateRating, ratingValue);
      
      const reviewCount = this.renderer.createElement('meta');
      this.renderer.setAttribute(reviewCount, 'itemprop', 'reviewCount');
      this.renderer.setAttribute(reviewCount, 'content', data.reviewCount);
      this.renderer.appendChild(aggregateRating, reviewCount);
      
      this.renderer.appendChild(metaContainer, aggregateRating);
    }
    
    // Marca (opcional)
    if (data.brand) {
      const brand = this.renderer.createElement('div');
      this.renderer.setAttribute(brand, 'itemprop', 'brand');
      this.renderer.setAttribute(brand, 'itemscope', '');
      this.renderer.setAttribute(brand, 'itemtype', 'https://schema.org/Brand');
      
      const brandName = this.renderer.createElement('meta');
      this.renderer.setAttribute(brandName, 'itemprop', 'name');
      this.renderer.setAttribute(brandName, 'content', data.brand);
      this.renderer.appendChild(brand, brandName);
      
      this.renderer.appendChild(metaContainer, brand);
    }
    
    // Adicionar o container de metadados ao elemento pai
    this.renderer.appendChild(parent, metaContainer);
  }

  /**
   * Cria metadados Schema.org para uma página de FAQs
   * @param parent Elemento pai onde os metadados serão adicionados
   * @param data Dados da página de FAQs
   */
  createFaqSchema(parent: HTMLElement, data: {
    questions: Array<{
      question: string;
      answer: string;
    }>;
  }): void {
    // Aplicar itemscope e itemtype ao container
    this.applySchema(parent, 'FAQPage');
    
    // Adicionar metadadados ocultos para dados que não estão visíveis no DOM
    const metaContainer = this.renderer.createElement('div');
    this.renderer.setStyle(metaContainer, 'display', 'none');
    
    // Adicionar cada pergunta e resposta
    data.questions.forEach(item => {
      const questionContainer = this.renderer.createElement('div');
      this.renderer.setAttribute(questionContainer, 'itemscope', '');
      this.renderer.setAttribute(questionContainer, 'itemtype', 'https://schema.org/Question');
      
      // Pergunta
      const question = this.renderer.createElement('meta');
      this.renderer.setAttribute(question, 'itemprop', 'name');
      this.renderer.setAttribute(question, 'content', item.question);
      this.renderer.appendChild(questionContainer, question);
      
      // Resposta
      const answerContainer = this.renderer.createElement('div');
      this.renderer.setAttribute(answerContainer, 'itemscope', '');
      this.renderer.setAttribute(answerContainer, 'itemtype', 'https://schema.org/Answer');
      this.renderer.setAttribute(answerContainer, 'itemprop', 'acceptedAnswer');
      
      const answer = this.renderer.createElement('meta');
      this.renderer.setAttribute(answer, 'itemprop', 'text');
      this.renderer.setAttribute(answer, 'content', item.answer);
      this.renderer.appendChild(answerContainer, answer);
      
      this.renderer.appendChild(questionContainer, answerContainer);
      this.renderer.appendChild(metaContainer, questionContainer);
    });
    
    // Adicionar o container de metadados ao elemento pai
    this.renderer.appendChild(parent, metaContainer);
  }

  /**
   * Cria metadados Schema.org para um curso
   * @param parent Elemento pai onde os metadados serão adicionados
   * @param data Dados do curso
   */
  createCourseSchema(parent: HTMLElement, data: {
    name: string;
    description: string;
    provider: string;
    imageUrl?: string;
    url?: string;
    dateCreated?: string;
    timeRequired?: string;
    contentLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    price?: string;
    currency?: string;
  }): void {
    // Aplicar itemscope e itemtype ao container
    this.applySchema(parent, 'Course');
    
    // Adicionar metadadados ocultos para dados que não estão visíveis no DOM
    const metaContainer = this.renderer.createElement('div');
    this.renderer.setStyle(metaContainer, 'display', 'none');
    
    // Nome do curso
    const name = this.renderer.createElement('meta');
    this.renderer.setAttribute(name, 'itemprop', 'name');
    this.renderer.setAttribute(name, 'content', data.name);
    this.renderer.appendChild(metaContainer, name);
    
    // Descrição
    const description = this.renderer.createElement('meta');
    this.renderer.setAttribute(description, 'itemprop', 'description');
    this.renderer.setAttribute(description, 'content', data.description);
    this.renderer.appendChild(metaContainer, description);
    
    // Provedor/Instituição
    const provider = this.renderer.createElement('div');
    this.renderer.setAttribute(provider, 'itemprop', 'provider');
    this.renderer.setAttribute(provider, 'itemscope', '');
    this.renderer.setAttribute(provider, 'itemtype', 'https://schema.org/Organization');
    
    const providerName = this.renderer.createElement('meta');
    this.renderer.setAttribute(providerName, 'itemprop', 'name');
    this.renderer.setAttribute(providerName, 'content', data.provider);
    this.renderer.appendChild(provider, providerName);
    this.renderer.appendChild(metaContainer, provider);
    
    // Imagem (opcional)
    if (data.imageUrl) {
      const image = this.renderer.createElement('meta');
      this.renderer.setAttribute(image, 'itemprop', 'image');
      this.renderer.setAttribute(image, 'content', data.imageUrl);
      this.renderer.appendChild(metaContainer, image);
    }
    
    // URL (opcional)
    if (data.url) {
      const url = this.renderer.createElement('meta');
      this.renderer.setAttribute(url, 'itemprop', 'url');
      this.renderer.setAttribute(url, 'content', data.url);
      this.renderer.appendChild(metaContainer, url);
    }
    
    // Data de criação (opcional)
    if (data.dateCreated) {
      const dateCreated = this.renderer.createElement('meta');
      this.renderer.setAttribute(dateCreated, 'itemprop', 'dateCreated');
      this.renderer.setAttribute(dateCreated, 'content', data.dateCreated);
      this.renderer.appendChild(metaContainer, dateCreated);
    }
    
    // Tempo necessário (opcional)
    if (data.timeRequired) {
      const timeRequired = this.renderer.createElement('meta');
      this.renderer.setAttribute(timeRequired, 'itemprop', 'timeRequired');
      this.renderer.setAttribute(timeRequired, 'content', data.timeRequired);
      this.renderer.appendChild(metaContainer, timeRequired);
    }
    
    // Nível de dificuldade (opcional)
    if (data.contentLevel) {
      const contentLevel = this.renderer.createElement('meta');
      this.renderer.setAttribute(contentLevel, 'itemprop', 'contentLevel');
      this.renderer.setAttribute(contentLevel, 'content', data.contentLevel);
      this.renderer.appendChild(metaContainer, contentLevel);
    }
    
    // Preço (opcional)
    if (data.price && data.currency) {
      const offers = this.renderer.createElement('div');
      this.renderer.setAttribute(offers, 'itemprop', 'offers');
      this.renderer.setAttribute(offers, 'itemscope', '');
      this.renderer.setAttribute(offers, 'itemtype', 'https://schema.org/Offer');
      
      const price = this.renderer.createElement('meta');
      this.renderer.setAttribute(price, 'itemprop', 'price');
      this.renderer.setAttribute(price, 'content', data.price);
      this.renderer.appendChild(offers, price);
      
      const currency = this.renderer.createElement('meta');
      this.renderer.setAttribute(currency, 'itemprop', 'priceCurrency');
      this.renderer.setAttribute(currency, 'content', data.currency);
      this.renderer.appendChild(offers, currency);
      
      this.renderer.appendChild(metaContainer, offers);
    }
    
    // Adicionar o container de metadados ao elemento pai
    this.renderer.appendChild(parent, metaContainer);
  }

  /**
   * Cria metadados Schema.org para uma organização
   * @param parent Elemento pai onde os metadados serão adicionados
   * @param data Dados da organização
   */
  createOrganizationSchema(parent: HTMLElement, data: {
    name: string;
    description: string;
    url: string;
    logo?: string;
    address?: {
      street: string;
      locality: string;
      region?: string;
      postalCode: string;
      country: string;
    };
    telephone?: string;
    email?: string;
    sameAs?: string[]; // URLs para perfis em redes sociais
  }): void {
    // Aplicar itemscope e itemtype ao container
    this.applySchema(parent, 'Organization');
    
    // Adicionar metadadados ocultos para dados que não estão visíveis no DOM
    const metaContainer = this.renderer.createElement('div');
    this.renderer.setStyle(metaContainer, 'display', 'none');
    
    // Nome da organização
    const name = this.renderer.createElement('meta');
    this.renderer.setAttribute(name, 'itemprop', 'name');
    this.renderer.setAttribute(name, 'content', data.name);
    this.renderer.appendChild(metaContainer, name);
    
    // Descrição
    const description = this.renderer.createElement('meta');
    this.renderer.setAttribute(description, 'itemprop', 'description');
    this.renderer.setAttribute(description, 'content', data.description);
    this.renderer.appendChild(metaContainer, description);
    
    // URL
    const url = this.renderer.createElement('meta');
    this.renderer.setAttribute(url, 'itemprop', 'url');
    this.renderer.setAttribute(url, 'content', data.url);
    this.renderer.appendChild(metaContainer, url);
    
    // Logo (opcional)
    if (data.logo) {
      const logo = this.renderer.createElement('meta');
      this.renderer.setAttribute(logo, 'itemprop', 'logo');
      this.renderer.setAttribute(logo, 'content', data.logo);
      this.renderer.appendChild(metaContainer, logo);
    }
    
    // Endereço (opcional)
    if (data.address) {
      const address = this.renderer.createElement('div');
      this.renderer.setAttribute(address, 'itemprop', 'address');
      this.renderer.setAttribute(address, 'itemscope', '');
      this.renderer.setAttribute(address, 'itemtype', 'https://schema.org/PostalAddress');
      
      const street = this.renderer.createElement('meta');
      this.renderer.setAttribute(street, 'itemprop', 'streetAddress');
      this.renderer.setAttribute(street, 'content', data.address.street);
      this.renderer.appendChild(address, street);
      
      const locality = this.renderer.createElement('meta');
      this.renderer.setAttribute(locality, 'itemprop', 'addressLocality');
      this.renderer.setAttribute(locality, 'content', data.address.locality);
      this.renderer.appendChild(address, locality);
      
      if (data.address.region) {
        const region = this.renderer.createElement('meta');
        this.renderer.setAttribute(region, 'itemprop', 'addressRegion');
        this.renderer.setAttribute(region, 'content', data.address.region);
        this.renderer.appendChild(address, region);
      }
      
      const postalCode = this.renderer.createElement('meta');
      this.renderer.setAttribute(postalCode, 'itemprop', 'postalCode');
      this.renderer.setAttribute(postalCode, 'content', data.address.postalCode);
      this.renderer.appendChild(address, postalCode);
      
      const country = this.renderer.createElement('meta');
      this.renderer.setAttribute(country, 'itemprop', 'addressCountry');
      this.renderer.setAttribute(country, 'content', data.address.country);
      this.renderer.appendChild(address, country);
      
      this.renderer.appendChild(metaContainer, address);
    }
    
    // Telefone (opcional)
    if (data.telephone) {
      const telephone = this.renderer.createElement('meta');
      this.renderer.setAttribute(telephone, 'itemprop', 'telephone');
      this.renderer.setAttribute(telephone, 'content', data.telephone);
      this.renderer.appendChild(metaContainer, telephone);
    }
    
    // Email (opcional)
    if (data.email) {
      const email = this.renderer.createElement('meta');
      this.renderer.setAttribute(email, 'itemprop', 'email');
      this.renderer.setAttribute(email, 'content', data.email);
      this.renderer.appendChild(metaContainer, email);
    }
    
    // SameAs (perfis em redes sociais)
    if (data.sameAs && data.sameAs.length > 0) {
      data.sameAs.forEach(socialUrl => {
        const sameAs = this.renderer.createElement('meta');
        this.renderer.setAttribute(sameAs, 'itemprop', 'sameAs');
        this.renderer.setAttribute(sameAs, 'content', socialUrl);
        this.renderer.appendChild(metaContainer, sameAs);
      });
    }
    
    // Adicionar o container de metadados ao elemento pai
    this.renderer.appendChild(parent, metaContainer);
  }

  /**
   * Cria metadados Schema.org para breadcrumbs
   * @param parent Elemento pai onde os metadados serão adicionados
   * @param data Dados do breadcrumb
   */
  createBreadcrumbSchema(parent: HTMLElement, data: {
    items: Array<{
      name: string;
      url: string;
    }>;
  }): void {
    // Aplicar itemscope e itemtype ao container
    this.applySchema(parent, 'BreadcrumbList');
    
    // Adicionar metadadados ocultos para dados que não estão visíveis no DOM
    const metaContainer = this.renderer.createElement('div');
    this.renderer.setStyle(metaContainer, 'display', 'none');
    
    // Adicionar cada item do breadcrumb
    data.items.forEach((item, index) => {
      const listItem = this.renderer.createElement('div');
      this.renderer.setAttribute(listItem, 'itemprop', 'itemListElement');
      this.renderer.setAttribute(listItem, 'itemscope', '');
      this.renderer.setAttribute(listItem, 'itemtype', 'https://schema.org/ListItem');
      
      // Posição
      const position = this.renderer.createElement('meta');
      this.renderer.setAttribute(position, 'itemprop', 'position');
      this.renderer.setAttribute(position, 'content', (index + 1).toString());
      this.renderer.appendChild(listItem, position);
      
      // Item
      const itemContainer = this.renderer.createElement('div');
      this.renderer.setAttribute(itemContainer, 'itemprop', 'item');
      this.renderer.setAttribute(itemContainer, 'itemscope', '');
      this.renderer.setAttribute(itemContainer, 'itemtype', 'https://schema.org/WebPage');
      
      const url = this.renderer.createElement('meta');
      this.renderer.setAttribute(url, 'itemprop', 'url');
      this.renderer.setAttribute(url, 'content', item.url);
      this.renderer.appendChild(itemContainer, url);
      
      const name = this.renderer.createElement('meta');
      this.renderer.setAttribute(name, 'itemprop', 'name');
      this.renderer.setAttribute(name, 'content', item.name);
      this.renderer.appendChild(itemContainer, name);
      
      this.renderer.appendChild(listItem, itemContainer);
      this.renderer.appendChild(metaContainer, listItem);
    });
    
    // Adicionar o container de metadados ao elemento pai
    this.renderer.appendChild(parent, metaContainer);
  }

  /**
   * Cria metadados Schema.org para uma pessoa/perfil
   * @param parent Elemento pai onde os metadados serão adicionados
   * @param data Dados da pessoa
   */
  createPersonSchema(parent: HTMLElement, data: {
    name: string;
    jobTitle?: string;
    description?: string;
    imageUrl?: string;
    email?: string;
    telephone?: string;
    url?: string;
    address?: {
      street?: string;
      locality: string;
      region?: string;
      postalCode?: string;
      country: string;
    };
    sameAs?: string[]; // URLs para perfis em redes sociais
  }): void {
    // Aplicar itemscope e itemtype ao container
    this.applySchema(parent, 'Person');
    
    // Adicionar metadadados ocultos para dados que não estão visíveis no DOM
    const metaContainer = this.renderer.createElement('div');
    this.renderer.setStyle(metaContainer, 'display', 'none');
    
    // Nome da pessoa
    const name = this.renderer.createElement('meta');
    this.renderer.setAttribute(name, 'itemprop', 'name');
    this.renderer.setAttribute(name, 'content', data.name);
    this.renderer.appendChild(metaContainer, name);
    
    // Cargo (opcional)
    if (data.jobTitle) {
      const jobTitle = this.renderer.createElement('meta');
      this.renderer.setAttribute(jobTitle, 'itemprop', 'jobTitle');
      this.renderer.setAttribute(jobTitle, 'content', data.jobTitle);
      this.renderer.appendChild(metaContainer, jobTitle);
    }
    
    // Descrição (opcional)
    if (data.description) {
      const description = this.renderer.createElement('meta');
      this.renderer.setAttribute(description, 'itemprop', 'description');
      this.renderer.setAttribute(description, 'content', data.description);
      this.renderer.appendChild(metaContainer, description);
    }
    
    // Imagem (opcional)
    if (data.imageUrl) {
      const image = this.renderer.createElement('meta');
      this.renderer.setAttribute(image, 'itemprop', 'image');
      this.renderer.setAttribute(image, 'content', data.imageUrl);
      this.renderer.appendChild(metaContainer, image);
    }
    
    // Email (opcional)
    if (data.email) {
      const email = this.renderer.createElement('meta');
      this.renderer.setAttribute(email, 'itemprop', 'email');
      this.renderer.setAttribute(email, 'content', data.email);
      this.renderer.appendChild(metaContainer, email);
    }
    
    // Telefone (opcional)
    if (data.telephone) {
      const telephone = this.renderer.createElement('meta');
      this.renderer.setAttribute(telephone, 'itemprop', 'telephone');
      this.renderer.setAttribute(telephone, 'content', data.telephone);
      this.renderer.appendChild(metaContainer, telephone);
    }
    
    // URL (opcional)
    if (data.url) {
      const url = this.renderer.createElement('meta');
      this.renderer.setAttribute(url, 'itemprop', 'url');
      this.renderer.setAttribute(url, 'content', data.url);
      this.renderer.appendChild(metaContainer, url);
    }
    
    // Endereço (opcional)
    if (data.address) {
      const address = this.renderer.createElement('div');
      this.renderer.setAttribute(address, 'itemprop', 'address');
      this.renderer.setAttribute(address, 'itemscope', '');
      this.renderer.setAttribute(address, 'itemtype', 'https://schema.org/PostalAddress');
      
      if (data.address.street) {
        const street = this.renderer.createElement('meta');
        this.renderer.setAttribute(street, 'itemprop', 'streetAddress');
        this.renderer.setAttribute(street, 'content', data.address.street);
        this.renderer.appendChild(address, street);
      }
      
      const locality = this.renderer.createElement('meta');
      this.renderer.setAttribute(locality, 'itemprop', 'addressLocality');
      this.renderer.setAttribute(locality, 'content', data.address.locality);
      this.renderer.appendChild(address, locality);
      
      if (data.address.region) {
        const region = this.renderer.createElement('meta');
        this.renderer.setAttribute(region, 'itemprop', 'addressRegion');
        this.renderer.setAttribute(region, 'content', data.address.region);
        this.renderer.appendChild(address, region);
      }
      
      if (data.address.postalCode) {
        const postalCode = this.renderer.createElement('meta');
        this.renderer.setAttribute(postalCode, 'itemprop', 'postalCode');
        this.renderer.setAttribute(postalCode, 'content', data.address.postalCode);
        this.renderer.appendChild(address, postalCode);
      }
      
      const country = this.renderer.createElement('meta');
      this.renderer.setAttribute(country, 'itemprop', 'addressCountry');
      this.renderer.setAttribute(country, 'content', data.address.country);
      this.renderer.appendChild(address, country);
      
      this.renderer.appendChild(metaContainer, address);
    }
    
    // SameAs (perfis em redes sociais)
    if (data.sameAs && data.sameAs.length > 0) {
      data.sameAs.forEach(socialUrl => {
        const sameAs = this.renderer.createElement('meta');
        this.renderer.setAttribute(sameAs, 'itemprop', 'sameAs');
        this.renderer.setAttribute(sameAs, 'content', socialUrl);
        this.renderer.appendChild(metaContainer, sameAs);
      });
    }
    
    // Adicionar o container de metadados ao elemento pai
    this.renderer.appendChild(parent, metaContainer);
  }

  /**
   * Cria metadados Schema.org para uma avaliação
   * @param parent Elemento pai onde os metadados serão adicionados
   * @param data Dados da avaliação
   */
  createReviewSchema(parent: HTMLElement, data: {
    itemReviewed: {
      type: string; // 'Product', 'Course', 'Organization', etc.
      name: string;
      url?: string;
    };
    reviewRating: {
      ratingValue: string;
      bestRating?: string;
      worstRating?: string;
    };
    author: string;
    datePublished: string;
    reviewBody: string;
  }): void {
    // Aplicar itemscope e itemtype ao container
    this.applySchema(parent, 'Review');
    
    // Adicionar metadadados ocultos para dados que não estão visíveis no DOM
    const metaContainer = this.renderer.createElement('div');
    this.renderer.setStyle(metaContainer, 'display', 'none');
    
    // Item avaliado
    const itemReviewed = this.renderer.createElement('div');
    this.renderer.setAttribute(itemReviewed, 'itemprop', 'itemReviewed');
    this.renderer.setAttribute(itemReviewed, 'itemscope', '');
    this.renderer.setAttribute(itemReviewed, 'itemtype', `https://schema.org/${data.itemReviewed.type}`);
    
    const itemName = this.renderer.createElement('meta');
    this.renderer.setAttribute(itemName, 'itemprop', 'name');
    this.renderer.setAttribute(itemName, 'content', data.itemReviewed.name);
    this.renderer.appendChild(itemReviewed, itemName);
    
    if (data.itemReviewed.url) {
      const itemUrl = this.renderer.createElement('meta');
      this.renderer.setAttribute(itemUrl, 'itemprop', 'url');
      this.renderer.setAttribute(itemUrl, 'content', data.itemReviewed.url);
      this.renderer.appendChild(itemReviewed, itemUrl);
    }
    
    this.renderer.appendChild(metaContainer, itemReviewed);
    
    // Avaliação
    const reviewRating = this.renderer.createElement('div');
    this.renderer.setAttribute(reviewRating, 'itemprop', 'reviewRating');
    this.renderer.setAttribute(reviewRating, 'itemscope', '');
    this.renderer.setAttribute(reviewRating, 'itemtype', 'https://schema.org/Rating');
    
    const ratingValue = this.renderer.createElement('meta');
    this.renderer.setAttribute(ratingValue, 'itemprop', 'ratingValue');
    this.renderer.setAttribute(ratingValue, 'content', data.reviewRating.ratingValue);
    this.renderer.appendChild(reviewRating, ratingValue);
    
    if (data.reviewRating.bestRating) {
      const bestRating = this.renderer.createElement('meta');
      this.renderer.setAttribute(bestRating, 'itemprop', 'bestRating');
      this.renderer.setAttribute(bestRating, 'content', data.reviewRating.bestRating);
      this.renderer.appendChild(reviewRating, bestRating);
    }
    
    if (data.reviewRating.worstRating) {
      const worstRating = this.renderer.createElement('meta');
      this.renderer.setAttribute(worstRating, 'itemprop', 'worstRating');
      this.renderer.setAttribute(worstRating, 'content', data.reviewRating.worstRating);
      this.renderer.appendChild(reviewRating, worstRating);
    }
    
    this.renderer.appendChild(metaContainer, reviewRating);
    
    // Autor
    const author = this.renderer.createElement('div');
    this.renderer.setAttribute(author, 'itemprop', 'author');
    this.renderer.setAttribute(author, 'itemscope', '');
    this.renderer.setAttribute(author, 'itemtype', 'https://schema.org/Person');
    
    const authorName = this.renderer.createElement('meta');
    this.renderer.setAttribute(authorName, 'itemprop', 'name');
    this.renderer.setAttribute(authorName, 'content', data.author);
    this.renderer.appendChild(author, authorName);
    
    this.renderer.appendChild(metaContainer, author);
    
    // Data de publicação
    const datePublished = this.renderer.createElement('meta');
    this.renderer.setAttribute(datePublished, 'itemprop', 'datePublished');
    this.renderer.setAttribute(datePublished, 'content', data.datePublished);
    this.renderer.appendChild(metaContainer, datePublished);
    
    // Corpo da avaliação
    const reviewBody = this.renderer.createElement('meta');
    this.renderer.setAttribute(reviewBody, 'itemprop', 'reviewBody');
    this.renderer.setAttribute(reviewBody, 'content', data.reviewBody);
    this.renderer.appendChild(metaContainer, reviewBody);
    
    // Adicionar o container de metadados ao elemento pai
    this.renderer.appendChild(parent, metaContainer);
  }

  /**
   * Método auxiliar para criar um elemento meta com itemprop
   * @param property Nome da propriedade itemprop
   * @param content Conteúdo do meta
   */
  createMetaWithItemprop(property: string, content: string): HTMLMetaElement {
    const meta = document.createElement('meta');
    meta.setAttribute('itemprop', property);
    meta.setAttribute('content', content);
    return meta;
  }
}

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo.service';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit, OnDestroy {
  products: Product[] = [
    {
      id: 1,
      name: 'E-book: Tecnologia para a Melhor Idade',
      description: 'Guia completo com dicas e tutoriais para facilitar o uso da tecnologia no dia a dia.',
      price: 29.90,
      imageUrl: 'assets/images/products/ebook-tech.jpg',
      category: 'e-books',
      inStock: true,
      rating: 4.8,
      reviewCount: 125
    },
    {
      id: 2,
      name: 'Curso: WhatsApp Avançado',
      description: 'Aprenda todos os recursos do WhatsApp para se comunicar com família e amigos de forma fácil.',
      price: 49.90,
      imageUrl: 'assets/images/products/curso-whatsapp.jpg',
      category: 'cursos',
      inStock: true,
      rating: 4.7,
      reviewCount: 98
    },
    {
      id: 3,
      name: 'Kit: Primeiros Passos na Internet',
      description: 'Material completo com guias impressos e vídeos para quem está começando a usar a internet.',
      price: 79.90,
      imageUrl: 'assets/images/products/kit-internet.jpg',
      category: 'kits',
      inStock: true,
      rating: 4.9,
      reviewCount: 64
    },
    {
      id: 4,
      name: 'Mentoria: Segurança Digital',
      description: 'Sessões de mentoria individual sobre como se proteger online e evitar golpes e fraudes.',
      price: 149.90,
      imageUrl: 'assets/images/products/mentoria-seguranca.jpg',
      category: 'mentorias',
      inStock: false,
      rating: 5.0,
      reviewCount: 42
    },
    {
      id: 5,
      name: 'Curso: Compras Online Seguras',
      description: 'Aprenda a fazer compras pela internet de forma segura e encontrar as melhores ofertas.',
      price: 59.90,
      imageUrl: 'assets/images/products/curso-compras.jpg',
      category: 'cursos',
      inStock: true,
      rating: 4.6,
      reviewCount: 87
    },
    {
      id: 6,
      name: 'E-book: Redes Sociais para Reconexão',
      description: 'Guia prático para utilizar redes sociais e se reconectar com amigos e familiares.',
      price: 24.90,
      imageUrl: 'assets/images/products/ebook-redes.jpg',
      category: 'e-books',
      inStock: true,
      rating: 4.5,
      reviewCount: 112
    }
  ];
  
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = 'todos';
  searchTerm: string = '';
  
  private seoService = inject(SeoService);
  
  ngOnInit(): void {
    this.filteredProducts = [...this.products];
    this.categories = ['todos', ...new Set(this.products.map(p => p.category))];
    
    // Configuração SEO
    this.seoService.updateAll({
      title: 'Loja Go Tech Talk | Produtos para Aprendizado Tecnológico',
      description: 'Encontre e-books, cursos e materiais didáticos para aprender tecnologia de forma simples e adaptada para o público da melhor idade.',
      keywords: 'loja tech talk, cursos tecnologia, e-books, melhor idade, idosos online',
      url: 'https://gotechtalks.com.br/loja',
      image: 'https://gotechtalks.com.br/assets/images/shop-cover.jpg',
      type: 'website'
    });
    
    // Adiciona JSON-LD para a loja e produtos
    this.seoService.addJsonLd({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": this.products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "image": `https://gotechtalks.com.br/${product.imageUrl}`,
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "BRL",
            "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.reviewCount
          }
        }
      }))
    });
  }
  
  ngOnDestroy(): void {
    this.seoService.removeJsonLd();
  }
  
  filterProducts(): void {
    let filtered = [...this.products];
    
    // Filtro por categoria
    if (this.selectedCategory !== 'todos') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    
    // Filtro por termo de busca
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
    }
    
    this.filteredProducts = filtered;
  }
  
  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }
  
  getRatingStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    // Adiciona estrelas cheias
    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }
    
    // Adiciona meia estrela se necessário
    if (hasHalfStar) {
      stars.push(0.5);
    }
    
    // Completa com estrelas vazias
    while (stars.length < 5) {
      stars.push(0);
    }
    
    return stars;
  }
}

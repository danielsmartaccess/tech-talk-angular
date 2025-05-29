import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BlogService, Post } from '../services/blog.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private seoService = inject(SeoService);

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    // Carregar posts do blog
    this.blogService.getPosts().subscribe(posts => {
      this.posts = posts;
      
      // Configurar metadados de SEO específicos para a página de blog
      this.seoService.updateAll({
        title: 'Blog Go Tech Talk | Artigos sobre Tecnologia para a Melhor Idade',
        description: 'Confira nossos artigos e tutoriais sobre tecnologia focados no público 55+, com dicas de WhatsApp, e-mail, segurança digital e muito mais!',
        keywords: 'blog tecnologia, dicas tecnologia melhor idade, tutoriais whatsapp, segurança internet para idosos',
        url: 'https://gotectalk.com.br/blog',
        image: 'https://gotectalk.com.br/assets/images/go.avif',
        type: 'blog'
      });
      
      // Adicionar JSON-LD com informações de Blog
      this.seoService.addJsonLd({
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Blog Go Tech Talk",
        "url": "https://gotectalk.com.br/blog",
        "description": "Um blog com dicas e tutoriais de tecnologia simplificados para o público da melhor idade (55+)",
        "publisher": {
          "@type": "Organization",
          "name": "Go Tech Talk",
          "logo": {
            "@type": "ImageObject",
            "url": "https://gotectalk.com.br/assets/images/go.avif"
          }
        },
        "blogPost": this.posts.map(post => ({
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "image": post.image,
          "url": post.url
        }))
      });
    });
  }
  
  ngOnDestroy(): void {
    // Remove o JSON-LD dinâmico ao sair da página
    this.seoService.removeJsonLd();
  }
}

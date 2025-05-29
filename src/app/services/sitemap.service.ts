import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

/**
 * Serviço para gerenciar o sitemap.xml do site
 * Responsável por gerar e atualizar o sitemap para melhorar a indexação nos motores de busca
 */
@Injectable({
  providedIn: 'root'
})
export class SitemapService {
  private baseUrl: string = 'https://gotechtalks.com.br';
  private routeConfig: {
    path: string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
  }[] = [
    { path: '/', changefreq: 'weekly', priority: 1.0 },
    { path: '/blog', changefreq: 'daily', priority: 0.9 },
    { path: '/eventos', changefreq: 'daily', priority: 0.8 },
    { path: '/membros', changefreq: 'weekly', priority: 0.7 },
    { path: '/planos-precos', changefreq: 'monthly', priority: 0.8 },
    { path: '/loja', changefreq: 'weekly', priority: 0.9 },
    { path: '/sobre', changefreq: 'monthly', priority: 0.6 },
    { path: '/contato', changefreq: 'monthly', priority: 0.6 },
    { path: '/ajuda', changefreq: 'monthly', priority: 0.7 },
    { path: '/login', changefreq: 'never', priority: 0.3 },
    { path: '/registro', changefreq: 'never', priority: 0.3 }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Gera o conteúdo XML do sitemap
   * @param dynamicRoutes Rotas dinâmicas adicionais a serem incluídas no sitemap
   * @returns String contendo o sitemap em formato XML
   */
  generateSitemapXml(dynamicRoutes: { path: string; lastmod: Date; changefreq: string; priority: number }[] = []): string {
    const currentDate = new Date().toISOString();
    
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Adicionar rotas estáticas
    this.routeConfig.forEach(route => {
      sitemapXml += `
  <url>
    <loc>${this.baseUrl}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`;
    });
    
    // Adicionar rotas dinâmicas
    dynamicRoutes.forEach(route => {
      sitemapXml += `
  <url>
    <loc>${this.baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod.toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`;
    });
    
    sitemapXml += `
</urlset>`;
    
    return sitemapXml;
  }

  /**
   * Envia o sitemap para o servidor
   * @param sitemapXml Conteúdo XML do sitemap
   * @returns Observable com a resposta do servidor
   */
  uploadSitemap(sitemapXml: string): Observable<any> {
    // Implementação real: envie o sitemap para o servidor usando uma API
    // Por enquanto, retornamos um observable simulado
    console.log('Sitemap enviado para o servidor:', sitemapXml);
    return of({ success: true, message: 'Sitemap enviado com sucesso' });
  }

  /**
   * Notifica os motores de busca sobre a atualização do sitemap
   * @returns Observable com o status das notificações
   */
  pingSearchEngines(): Observable<any> {
    const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
    const engines = [
      `http://www.google.com/ping?sitemap=${sitemapUrl}`,
      `http://www.bing.com/ping?sitemap=${sitemapUrl}`
    ];
    
    // Implementação real: faça requisições para os motores de busca
    console.log('Motores de busca notificados sobre o sitemap');
    return of({ success: true, message: 'Motores de busca notificados' });
  }

  /**
   * Gera, envia e notifica os motores de busca sobre o sitemap atualizado
   * @param dynamicRoutes Rotas dinâmicas adicionais a serem incluídas no sitemap
   * @returns Observable com o status da operação
   */
  updateSitemap(dynamicRoutes: { path: string; lastmod: Date; changefreq: string; priority: number }[] = []): Observable<any> {
    const xml = this.generateSitemapXml(dynamicRoutes);
    return this.uploadSitemap(xml);
    // Na implementação real, encadeie com pingSearchEngines
  }
}

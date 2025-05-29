import { Injectable } from '@angular/core';

/**
 * Interface para configuração de exportação de dados estruturados
 */
interface StructuredDataExportConfig {
  title: string;
  description?: string;
  format: 'json' | 'csv' | 'rss' | 'atom';
  filename?: string;
  data: any;
  callback?: (result: string) => void;
}

/**
 * Serviço para exportar e gerenciar dados estruturados para acessibilidade
 * e distribuição de conteúdo em diferentes formatos.
 */
@Injectable({
  providedIn: 'root'
})
export class StructuredDataExportService {
  constructor() {}

  /**
   * Exporta dados estruturados no formato especificado
   * @param config Configuração da exportação
   * @returns URL ou string com os dados estruturados
   */
  exportData(config: StructuredDataExportConfig): string {
    let result = '';
    
    switch (config.format) {
      case 'json':
        result = this.generateJSON(config.data);
        break;
      case 'csv':
        result = this.generateCSV(config.data);
        break;
      case 'rss':
        result = this.generateRSS(config);
        break;
      case 'atom':
        result = this.generateAtom(config);
        break;
    }
    
    if (config.callback) {
      config.callback(result);
    }
    
    if (config.filename) {
      return this.createDownloadLink(result, config.filename, this.getMimeType(config.format));
    }
    
    return result;
  }

  /**
   * Gera um feed RSS para conteúdo de blog/notícias
   * @param config Configuração com dados do conteúdo
   * @returns String com XML do feed RSS
   */
  private generateRSS(config: StructuredDataExportConfig): string {
    const { title, description = '', data } = config;
    const now = new Date().toUTCString();
    
    // Cabeçalho do feed RSS
    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${this.escapeXml(title)}</title>
  <description>${this.escapeXml(description)}</description>
  <link>https://gotechtalks.com.br</link>
  <language>pt-br</language>
  <lastBuildDate>${now}</lastBuildDate>
  <atom:link href="https://gotechtalks.com.br/feed.rss" rel="self" type="application/rss+xml" />
`;
    
    // Adiciona os itens (posts, artigos, etc)
    if (Array.isArray(data)) {
      data.forEach(item => {
        const pubDate = item.publishDate ? new Date(item.publishDate).toUTCString() : now;
        
        rss += `  <item>
    <title>${this.escapeXml(item.title)}</title>
    <description>${this.escapeXml(item.description || item.summary || '')}</description>
    <link>https://gotechtalks.com.br/${item.url || `blog/${item.slug || ''}`}</link>
    <guid isPermaLink="false">${item.id || item.slug || Math.random().toString(36).substring(2)}</guid>
    <pubDate>${pubDate}</pubDate>
    ${item.author ? `<author>${this.escapeXml(item.author)}</author>` : ''}
    ${item.category ? `<category>${this.escapeXml(item.category)}</category>` : ''}
  </item>
`;
      });
    }
    
    // Fecha o feed RSS
    rss += `</channel>
</rss>`;
    
    return rss;
  }

  /**
   * Gera um feed Atom para conteúdo de blog/notícias
   * @param config Configuração com dados do conteúdo
   * @returns String com XML do feed Atom
   */
  private generateAtom(config: StructuredDataExportConfig): string {
    const { title, description = '', data } = config;
    const now = new Date().toISOString();
    
    // Cabeçalho do feed Atom
    let atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${this.escapeXml(title)}</title>
  <subtitle>${this.escapeXml(description)}</subtitle>
  <link href="https://gotechtalks.com.br" rel="alternate" type="text/html"/>
  <link href="https://gotechtalks.com.br/feed.atom" rel="self" type="application/atom+xml"/>
  <id>https://gotechtalks.com.br/</id>
  <updated>${now}</updated>
  <author>
    <name>Go Tech Talk</name>
  </author>
`;
    
    // Adiciona os itens (entries)
    if (Array.isArray(data)) {
      data.forEach(item => {
        const updated = item.updateDate ? new Date(item.updateDate).toISOString() : now;
        const published = item.publishDate ? new Date(item.publishDate).toISOString() : updated;
        
        atom += `  <entry>
    <title>${this.escapeXml(item.title)}</title>
    <link href="https://gotechtalks.com.br/${item.url || `blog/${item.slug || ''}`}" rel="alternate" type="text/html"/>
    <id>https://gotechtalks.com.br/${item.url || `blog/${item.slug || ''}`}</id>
    <published>${published}</published>
    <updated>${updated}</updated>
    ${item.author ? `<author><name>${this.escapeXml(item.author)}</name></author>` : ''}
    <summary>${this.escapeXml(item.summary || item.description || '')}</summary>
    ${item.content ? `<content type="html"><![CDATA[${item.content}]]></content>` : ''}
  </entry>
`;
      });
    }
    
    // Fecha o feed Atom
    atom += `</feed>`;
    
    return atom;
  }

  /**
   * Gera uma string JSON a partir de dados
   * @param data Dados a serem convertidos
   * @returns String JSON formatada
   */
  private generateJSON(data: any): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      console.error('Erro ao gerar JSON:', e);
      return '{}';
    }
  }

  /**
   * Gera um arquivo CSV a partir de dados
   * @param data Array de objetos ou objeto a ser convertido
   * @returns String CSV formatada
   */
  private generateCSV(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) {
      return '';
    }
    
    // Extrai os cabeçalhos (chaves do primeiro objeto)
    const headers = Object.keys(data[0]);
    
    // Cria a linha de cabeçalho
    let csv = headers.map(header => `"${header}"`).join(',') + '\n';
    
    // Adiciona as linhas de dados
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        if (value === null || value === undefined) return '""';
        
        // Formata o valor com base em seu tipo
        if (typeof value === 'string') {
          // Escapa aspas duplas e envolve em aspas
          return `"${value.replace(/"/g, '""')}"`;
        } else if (value instanceof Date) {
          return `"${value.toISOString()}"`;
        } else if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        } else {
          return `"${value}"`;
        }
      }).join(',');
      
      csv += row + '\n';
    });
    
    return csv;
  }

  /**
   * Cria um link de download para os dados gerados
   * @param data Dados a serem baixados
   * @param filename Nome do arquivo
   * @param mimeType Tipo MIME dos dados
   * @returns URL de objeto para download
   */
  private createDownloadLink(data: string, filename: string, mimeType: string): string {
    const blob = new Blob([data], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  /**
   * Obtém o tipo MIME com base no formato
   * @param format Formato dos dados
   * @returns String com o tipo MIME
   */
  private getMimeType(format: string): string {
    switch (format) {
      case 'json': return 'application/json';
      case 'csv': return 'text/csv';
      case 'rss': return 'application/rss+xml';
      case 'atom': return 'application/atom+xml';
      default: return 'text/plain';
    }
  }

  /**
   * Escapa caracteres especiais para XML
   * @param text Texto a ser escapado
   * @returns Texto com caracteres escapados
   */
  private escapeXml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;'
    };
    
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

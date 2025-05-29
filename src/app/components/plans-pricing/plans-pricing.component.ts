import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';

interface Plan {
  id: string;
  name: string;
  price: number;
  billingPeriod: string;
  description: string;
  features: string[];
  recommended: boolean;
}

@Component({
  selector: 'app-plans-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plans-pricing.component.html',
  styleUrl: './plans-pricing.component.scss'
})
export class PlansPricingComponent implements OnInit, OnDestroy {
  plans: Plan[] = [
    {
      id: 'standard',
      name: 'Padrão',
      price: 0,
      billingPeriod: 'mês',
      description: 'Acesso básico à plataforma Go Tech Talk',
      features: [
        'Acesso a conteúdos básicos',
        'Participação em 1 evento por mês',
        'Acesso ao fórum da comunidade',
        'Suporte por e-mail'
      ],
      recommended: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29.90,
      billingPeriod: 'mês',
      description: 'Acesso expandido com recursos exclusivos',
      features: [
        'Todos os benefícios do plano Padrão',
        'Acesso a conteúdos avançados',
        'Participação em eventos ilimitados',
        'Aulas ao vivo semanais',
        'Suporte prioritário'
      ],
      recommended: true
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 59.90,
      billingPeriod: 'mês',
      description: 'Experiência completa e personalizada',
      features: [
        'Todos os benefícios do plano Premium',
        'Consultoria individual mensal (1h)',
        'Acesso antecipado a novos recursos',
        'Eventos exclusivos para VIPs',
        'Suporte 24/7 por telefone',
        'Desconto em produtos da loja'
      ],
      recommended: false
    }
  ];
  
  private seoService = inject(SeoService);
  
  frequentlyAskedQuestions = [
    {
      question: 'Posso mudar de plano a qualquer momento?',
      answer: 'Sim, você pode atualizar ou fazer downgrade do seu plano a qualquer momento. As mudanças entrarão em vigor imediatamente, e o valor será ajustado proporcionalmente ao período restante.'
    },
    {
      question: 'Existe algum desconto para pagamento anual?',
      answer: 'Sim! Oferecemos 20% de desconto para assinaturas anuais em todos os planos pagos.'
    },
    {
      question: 'Como funciona a política de reembolso?',
      answer: 'Oferecemos garantia de devolução do dinheiro por 15 dias. Se você não estiver satisfeito com nossos serviços, entre em contato com o suporte para solicitar o reembolso completo.'
    },
    {
      question: 'Qual a diferença entre os planos Premium e VIP?',
      answer: 'O plano VIP inclui atendimento personalizado e consultoria individual, além de acesso prioritário a novos recursos e eventos exclusivos.'
    }
  ];

  ngOnInit(): void {
    // Configuração SEO
    this.seoService.updateAll({
      title: 'Planos e Preços | Go Tech Talk | Escolha o Plano Ideal',
      description: 'Conheça os planos da Go Tech Talk e escolha a melhor opção para aprender tecnologia de forma simples e acessível para a melhor idade.',
      keywords: 'planos tech talk, preços, assinatura, premium melhor idade, tecnologia idosos',
      url: 'https://gotechtalks.com.br/planos-precos',
      image: 'https://gotechtalks.com.br/assets/images/plans-cover.jpg',
      type: 'website'
    });
    
    // Adiciona JSON-LD para os planos de assinatura
    this.seoService.addJsonLd({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": this.plans.map((plan, index) => ({
        "@type": "Offer",
        "position": index + 1,
        "name": plan.name,
        "description": plan.description,
        "price": plan.price,
        "priceCurrency": "BRL",
        "availabilityStarts": new Date().toISOString(),
        "url": `https://gotechtalks.com.br/planos-precos#${plan.id}`
      }))
    });
  }
  
  ngOnDestroy(): void {
    this.seoService.removeJsonLd();
  }
  
  formatPrice(price: number): string {
    return price === 0 ? 'Gratuito' : `R$ ${price.toFixed(2).replace('.', ',')}`;
  }
}

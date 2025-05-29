import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User, UserService } from '../../services/user.service';
import { EventService, Event } from '../../services/event.service';
import { SeoService } from '../../services/seo.service';

/**
 * Componente para exibição e gerenciamento de membros
 */
@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent implements OnInit, OnDestroy {
  members: User[] = [];
  filteredMembers: User[] = [];
  searchTerm: string = '';
  filterType: string = 'all';
  selectedMember: User | null = null;
  // Propriedades para as estatísticas
  totalMembers: number = 0;
  premiumMembers: number = 0;
  eventParticipants: { [key: number]: number } = {};
  eventParticipantsCount: number = 0;
  
  // Propriedade para armazenar eventos do membro selecionado
  memberEvents: Event[] = [];
  isLoadingEvents: boolean = false;

  private seoService = inject(SeoService);
  
  constructor(
    private userService: UserService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.loadMembers();
    this.loadEventParticipation();
    
    // Configuração SEO
    this.seoService.updateAll({
      title: 'Membros Go Tech Talk | Nossa Comunidade de Tecnologia para a Melhor Idade',
      description: 'Conheça os membros da comunidade Go Tech Talk dedicada a ensinar tecnologia para pessoas com mais de 55 anos de forma simples e acessível.',
      keywords: 'membros tech talk, comunidade tecnologia melhor idade, membros 55+, tecnologia para idosos',
      url: 'https://gotechtalks.com.br/members',
      image: 'https://gotechtalks.com.br/assets/images/members-cover.jpg',
      type: 'website'
    });
    
    // Adiciona JSON-LD para Organization com membros
    this.seoService.addJsonLd({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Go Tech Talk",
      "url": "https://gotechtalks.com.br",
      "logo": "https://gotechtalks.com.br/assets/images/logo.png",
      "description": "Comunidade de tecnologia para pessoas com mais de 55 anos",
      "member": {
        "@type": "OrganizationRole",
        "roleName": "Membro",
        "description": "Membros da comunidade Go Tech Talk"
      }
    });
  }

  ngOnDestroy(): void {
    this.seoService.removeJsonLd();
  }

  /**
   * Carrega todos os membros do serviço
   */
  loadMembers(): void {
    this.userService.getUsers().subscribe(members => {
      this.members = members;
      this.filteredMembers = [...members];
      this.totalMembers = members.length;
      this.premiumMembers = members.filter(m => m.membershipType !== 'standard').length;
      this.applyFilters();
    });
  }
  /**
   * Carrega informações de participação em eventos
   */  
  loadEventParticipation(): void {
    this.eventService.getEvents().subscribe(events => {
      let totalParticipants = 0;
      events.forEach(event => {
        if (event.participants && event.id) {
          const participantCount = event.participants.length;
          this.eventParticipants[event.id] = participantCount;
          totalParticipants += participantCount;
        }
      });
      // Contar total de participantes em eventos
      this.eventParticipantsCount = totalParticipants;
    });
  }

  /**
   * Aplica filtros aos membros
   */
  applyFilters(): void {
    let filtered = [...this.members];
    
    // Aplicar filtro por tipo de associação
    if (this.filterType !== 'all') {
      filtered = filtered.filter(member => member.membershipType === this.filterType);
    }
    
    // Aplicar filtro de busca por texto
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.phone.toLowerCase().includes(term) ||
        member.interests.some(interest => interest.toLowerCase().includes(term))
      );
    }
    
    this.filteredMembers = filtered;
  }

  /**
   * Limpa todos os filtros aplicados
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.filterType = 'all';
    this.filteredMembers = [...this.members];
  }

  /**
   * Exibe detalhes de um membro e carrega seus eventos
   */
  showMemberDetails(member: User): void {
    this.selectedMember = member;
    this.loadMemberEvents(member.id);
  }

  /**
   * Carrega os eventos em que o membro está inscrito
   */
  loadMemberEvents(memberId: number): void {
    this.isLoadingEvents = true;
    this.memberEvents = [];
    
    this.eventService.getUserEvents(memberId).subscribe({
      next: (events) => {
        this.memberEvents = events;
        this.isLoadingEvents = false;
      },
      error: (err) => {
        console.error('Erro ao carregar eventos do membro:', err);
        this.isLoadingEvents = false;
      }
    });
  }

  /**
   * Fecha o modal de detalhes do membro
   */
  closeMemberDetails(): void {
    this.selectedMember = null;
    this.memberEvents = [];
  }

  /**
   * Retorna uma classe CSS baseada no interesse
   */
  getInterestsTagClass(interest: string): string {
    const classes = [
      'tag-blue', 'tag-green', 'tag-purple', 'tag-orange', 'tag-red', 'tag-teal', 'tag-pink'
    ];
    
    // Gerar um índice baseado no texto do interesse
    const hash = interest.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + acc;
    }, 0);
    
    return classes[hash % classes.length];
  }

  /**
   * Retorna uma classe CSS para o badge de tipo de associação
   */
  getMembershipBadgeClass(type: string): string {
    switch (type) {
      case 'premium': return 'badge-premium';
      case 'vip': return 'badge-vip';
      default: return 'badge-standard';
    }
  }

  /**
   * Retorna um label para o tipo de associação
   */
  getMembershipLabel(type: string): string {
    switch (type) {
      case 'premium': return 'Premium';
      case 'vip': return 'VIP';
      default: return 'Padrão';
    }
  }

  /**
   * Formata uma data para exibição no padrão brasileiro
   */
  formatDate(date: Date): string {
    if (!date) return '';
    
    const newDate = new Date(date);
    return newDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}

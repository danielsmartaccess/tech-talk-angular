import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserService, User } from './user.service';

/**
 * Interface para o modelo de Evento
 */
export interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  price: number;
  instructor: string;
  image?: string;
  participants?: number[];
}

/**
 * Interface para detalhes do evento com informações dos participantes
 */
export interface EventDetails extends Event {
  participantDetails?: User[];
}

/**
 * Serviço responsável pelo gerenciamento de eventos
 */
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/events';
  
  // Array local para armazenar eventos em memória (simulando backend)
  private events: Event[] = [
    {
      id: 1,
      title: 'Workshop de WhatsApp Avançado',
      description: 'Aprenda recursos avançados do WhatsApp como configurações de privacidade, backup de conversas e utilização em múltiplos dispositivos.',
      date: '2023-06-15',
      location: 'Centro Comunitário Tech Talk',
      capacity: 20,
      price: 50,
      instructor: 'Daniel Steinbruch',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
      participants: [1, 3, 5]
    },
    {
      id: 2,
      title: 'Curso de Segurança Digital para Iniciantes',
      description: 'Aprenda a reconhecer golpes virtuais, criar senhas seguras e proteger seus dados pessoais na internet.',
      date: '2023-06-25',
      location: 'Espaço Cultural Digital',
      capacity: 15,
      price: 70,
      instructor: 'Maria Silva',
      image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87',
      participants: [2, 4]
    },
    {
      id: 3,
      title: 'Introdução ao ChatGPT e IA para Seniors',
      description: 'Descubra como a inteligência artificial pode facilitar seu dia a dia com exemplos práticos usando o ChatGPT.',
      date: '2023-07-10',
      location: 'Centro Comunitário Tech Talk',
      capacity: 25,
      price: 60,
      instructor: 'Daniel Steinbruch',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad379',
      participants: []
    }
  ];

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }
  // Obtém todos os eventos
  /**
   * Obtém todos os eventos disponíveis na plataforma
   * @returns Observable com array de eventos
   */
  getEvents(): Observable<Event[]> {
    // Na implementação real, usaríamos:
    // return this.http.get<Event[]>(this.apiUrl);
    return of(this.events);
  }

  // Obtém um evento específico por ID
  /**
   * Obtém um evento específico pelo seu ID
   * @param id ID do evento a ser buscado
   * @returns Observable com o evento encontrado ou erro se não existir
   */
  getEvent(id: number): Observable<Event> {
    const event = this.events.find(e => e.id === id);
    if (event) {
      return of(event);
    }
    return throwError(() => new Error(`Evento com ID ${id} não encontrado`));
  }

  // Adiciona um novo evento
  /**
   * Adiciona um novo evento à plataforma
   * @param event Dados do evento a ser adicionado (sem ID)
   * @returns Observable com o evento criado, incluindo seu ID
   */
  addEvent(event: Event): Observable<Event> {
    // Simulando geração de ID
    const newEvent = { 
      ...event, 
      id: Math.max(0, ...this.events.map(e => e.id || 0)) + 1,
      participants: []
    };
    this.events.push(newEvent);
    return of(newEvent);
  }
  // Atualiza um evento existente
  /**
   * Atualiza os dados de um evento existente
   * @param event Dados atualizados do evento (deve incluir ID)
   * @returns Observable com o evento atualizado ou erro
   */
  updateEvent(event: Event): Observable<Event> {
    const index = this.events.findIndex(e => e.id === event.id);
    if (index !== -1) {
      this.events[index] = event;
      return of(event);
    }
    return throwError(() => new Error(`Evento com ID ${event.id} não encontrado`));
  }

  // Remove um evento
  /**
   * Remove um evento da plataforma
   * @param id ID do evento a ser removido
   * @returns Observable vazio em caso de sucesso ou erro
   */
  deleteEvent(id: number): Observable<void> {
    const index = this.events.findIndex(e => e.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
      return of(undefined);
    }
    return throwError(() => new Error(`Evento com ID ${id} não encontrado`));
  }
  // Adiciona um participante ao evento
  /**
   * Inscreve um usuário em um evento
   * @param eventId ID do evento
   * @param userId ID do usuário a ser inscrito
   * @returns Observable com o evento atualizado ou erro
   */
  addParticipant(eventId: number, userId: number): Observable<Event> {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      if (!event.participants) {
        event.participants = [];
      }
      if (!event.participants.includes(userId)) {
        event.participants.push(userId);
      }
      return of(event);
    }
    return throwError(() => new Error(`Evento com ID ${eventId} não encontrado`));
  }

  // Remove um participante do evento
  /**
   * Cancela a inscrição de um usuário em um evento
   * @param eventId ID do evento
   * @param userId ID do usuário a ser removido
   * @returns Observable com o evento atualizado ou erro
   */
  removeParticipant(eventId: number, userId: number): Observable<Event> {
    const event = this.events.find(e => e.id === eventId);
    if (event && event.participants) {
      const index = event.participants.indexOf(userId);
      if (index !== -1) {
        event.participants.splice(index, 1);
      }
      return of(event);
    }
    return throwError(() => new Error(`Evento com ID ${eventId} não encontrado`));
  }
  /**
   * Obtém todos os eventos com detalhes dos participantes
   * @returns Observable com lista de eventos e detalhes dos participantes
   */
  getEventsWithParticipants(): Observable<EventDetails[]> {
    return forkJoin({
      events: this.getEvents(),
      users: this.userService.getUsers()
    }).pipe(
      map(({ events, users }) => {
        return events.map(event => {
          const eventWithDetails: EventDetails = { ...event };
          
          if (event.participants && event.participants.length > 0) {
            eventWithDetails.participantDetails = users.filter(user => 
              event.participants?.includes(user.id)
            );
          }
          
          return eventWithDetails;
        });
      })
    );
  }
  
  /**
   * Obtém um evento específico com detalhes dos participantes
   * @param id ID do evento
   * @returns Observable com evento e detalhes dos participantes
   */
  getEventWithParticipants(id: number): Observable<EventDetails> {
    return forkJoin({
      event: this.getEvent(id),
      users: this.userService.getUsers()
    }).pipe(
      map(({ event, users }) => {
        const eventWithDetails: EventDetails = { ...event };
        
        if (event.participants && event.participants.length > 0) {
          eventWithDetails.participantDetails = users.filter(user => 
            event.participants?.includes(user.id)
          );
        }
        
        return eventWithDetails;
      })
    );
  }
  
  /**
   * Obtém os eventos em que um usuário está inscrito
   * @param userId ID do usuário
   * @returns Observable com lista de eventos em que o usuário está inscrito
   */
  getUserEvents(userId: number): Observable<Event[]> {
    return this.getEvents().pipe(
      map(events => events.filter(event => 
        event.participants && event.participants.includes(userId)
      ))
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Event, EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  eventForm!: FormGroup;
  searchTerm: string = '';
  isEditing: boolean = false;
  selectedEvent: Event | null = null;
  showForm: boolean = false;
  currentUserId: number = 1; // Simulando usuário logado

  constructor(
    private eventService: EventService, 
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.initForm();
  }
  /**
   * Inicializa o formulário de eventos com validações
   * @private
   */
  private initForm(): void {
    this.eventForm = this.fb.group({
      id: [null],
      title: ['', [
        Validators.required, 
        Validators.minLength(5), 
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required, 
        Validators.minLength(20),
        Validators.maxLength(500)
      ]],
      date: ['', [
        Validators.required,
        this.dateValidator
      ]],
      location: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],
      capacity: [null, [
        Validators.required, 
        Validators.min(1),
        Validators.max(1000),
        Validators.pattern('^[0-9]*$')
      ]],
      price: [null, [
        Validators.required, 
        Validators.min(0),
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
      ]],
      instructor: ['', [
        Validators.required, 
        Validators.minLength(3)
      ]],
      image: ['', [
        Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
      ]]
    });
  }
  
  /**
   * Valida se a data do evento é futura
   * @param control - Controle do formulário a ser validado
   * @returns Objeto com erro se a data for inválida, null caso contrário
   */
  dateValidator(control: { value: string }): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDate = new Date(control.value);
    eventDate.setHours(0, 0, 0, 0);
    
    return eventDate >= today ? null : { 'pastDate': true };
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      this.filteredEvents = [...events];
    });
  }

  searchEvents(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEvents = [...this.events];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredEvents = this.events.filter(event => 
      event.title.toLowerCase().includes(term) ||
      event.description.toLowerCase().includes(term) ||
      event.location.toLowerCase().includes(term) ||
      event.instructor.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchEvents();
  }

  openAddForm(): void {
    this.isEditing = false;
    this.selectedEvent = null;
    this.eventForm.reset();
    this.showForm = true;
  }

  openEditForm(event: Event): void {
    this.isEditing = true;
    this.selectedEvent = event;
    this.eventForm.patchValue(event);
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.eventForm.reset();
  }

  deleteEvent(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.loadEvents();
        },
        error: (err) => {
          console.error('Erro ao excluir evento:', err);
        }
      });
    }
  }
  /**
   * Marca todos os campos do formulário como tocados para exibir validações
   */
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Salva um evento (novo ou editado)
   */
  saveEvent(): void {
    if (this.eventForm.invalid) {
      // Marcar todos os campos como tocados para mostrar validações
      this.markFormGroupTouched(this.eventForm);
      return;
    }

    const eventData = this.eventForm.value;
    
    // Verificar se a data está no futuro
    const eventDate = new Date(eventData.date);
    const today = new Date();
    if (eventDate < today) {
      alert('A data do evento deve ser no futuro.');
      return;
    }
    
    if (this.isEditing && this.selectedEvent?.id) {
      // Preservar os participantes ao atualizar o evento
      eventData.participants = this.selectedEvent.participants || [];
      
      // Atualizar evento existente
      this.eventService.updateEvent(eventData).subscribe({
        next: () => {
          this.loadEvents();
          this.closeForm();
          alert('Evento atualizado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao atualizar evento:', err);
          alert('Erro ao atualizar evento. Por favor, tente novamente.');
        }
      });
    } else {
      // Adicionar novo evento com array de participantes vazio
      eventData.participants = [];
      
      // Adicionar novo evento
      this.eventService.addEvent(eventData).subscribe({
        next: () => {
          this.loadEvents();
          this.closeForm();
          alert('Evento adicionado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao adicionar evento:', err);
          alert('Erro ao adicionar evento. Por favor, tente novamente.');
        }
      });
    }
  }

  isEventFull(event: Event): boolean {
    return !!(event.participants && event.capacity && event.participants.length >= event.capacity);
  }

  isUserRegistered(event: Event): boolean {
    return !!(event.participants && event.participants.includes(this.currentUserId));
  }

  registerForEvent(event: Event): void {
    if (!event.id) return;
    
    this.eventService.addParticipant(event.id, this.currentUserId).subscribe({
      next: () => {
        this.loadEvents();
      },
      error: (err) => {
        console.error('Erro ao registrar para o evento:', err);
      }
    });
  }

  unregisterFromEvent(event: Event): void {
    if (!event.id) return;
    
    this.eventService.removeParticipant(event.id, this.currentUserId).subscribe({
      next: () => {
        this.loadEvents();
      },
      error: (err) => {
        console.error('Erro ao cancelar registro do evento:', err);
      }
    });
  }

  // Transformar data no formato YYYY-MM-DD para "DD de Mês de YYYY"
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month} de ${year}`;
  }
}

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

/**
 * Interface para o modelo de Usuário na plataforma
 */
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  registrationDate: Date;
  membershipType: 'standard' | 'premium' | 'vip';
  interests: string[];
}

/**
 * Serviço responsável pela gestão dos usuários da plataforma
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Array local para simular dados de membros
  private users: User[] = [
    {
      id: 1,
      name: 'Maria Silva',
      email: 'maria.silva@example.com',
      phone: '(51) 98765-4321',
      profileImage: 'https://randomuser.me/api/portraits/women/65.jpg',
      registrationDate: new Date('2023-01-15'),
      membershipType: 'premium',
      interests: ['WhatsApp', 'E-mail', 'Segurança']
    },
    {
      id: 2,
      name: 'João Pereira',
      email: 'joao.pereira@example.com',
      phone: '(51) 91234-5678',
      profileImage: 'https://randomuser.me/api/portraits/men/72.jpg',
      registrationDate: new Date('2023-02-20'),
      membershipType: 'standard',
      interests: ['Redes Sociais', 'Videochamadas']
    },
    {
      id: 3,
      name: 'Ana Oliveira',
      email: 'ana.oliveira@example.com',
      phone: '(51) 99876-5432',
      profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
      registrationDate: new Date('2023-03-10'),
      membershipType: 'vip',
      interests: ['Compras Online', 'Aplicativos Bancários', 'Streaming']
    },
    {
      id: 4,
      name: 'Carlos Santos',
      email: 'carlos.santos@example.com',
      phone: '(51) 98765-1234',
      profileImage: 'https://randomuser.me/api/portraits/men/52.jpg',
      registrationDate: new Date('2023-04-05'),
      membershipType: 'standard',
      interests: ['WhatsApp', 'Redes Sociais']
    },
    {
      id: 5,
      name: 'Luiza Fernandes',
      email: 'luiza.fernandes@example.com',
      phone: '(51) 95432-1098',
      profileImage: 'https://randomuser.me/api/portraits/women/32.jpg',
      registrationDate: new Date('2023-05-18'),
      membershipType: 'premium',
      interests: ['Fotografia Digital', 'Edição de Imagens', 'WhatsApp']
    }
  ];
  constructor() { }

  /**
   * Obtém todos os usuários registrados no sistema
   * @returns Observable com a lista de usuários
   */
  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  /**
   * Obtém um usuário específico pelo seu ID
   * @param id ID do usuário a ser buscado
   * @returns Observable com o usuário encontrado ou erro
   */
  getUser(id: number): Observable<User> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      return of(user);
    }
    return throwError(() => new Error(`Usuário com ID ${id} não encontrado`));
  }

  /**
   * Adiciona um novo usuário ao sistema
   * @param user Dados do usuário a ser adicionado
   * @returns Observable com o usuário criado, incluindo seu ID e data de registro
   */
  addUser(user: User): Observable<User> {
    // Simulando geração de ID
    const newUser = { 
      ...user, 
      id: Math.max(0, ...this.users.map(u => u.id)) + 1,
      registrationDate: new Date()
    };
    this.users.push(newUser);
    return of(newUser);
  }

  /**
   * Atualiza os dados de um usuário existente
   * @param user Dados atualizados do usuário (deve incluir ID)
   * @returns Observable com o usuário atualizado ou erro
   */
  updateUser(user: User): Observable<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...user };
      return of(this.users[index]);
    }
    return throwError(() => new Error(`Usuário com ID ${user.id} não encontrado`));
  }
  /**
   * Remove um usuário do sistema
   * @param id ID do usuário a ser removido
   * @returns Observable vazio em caso de sucesso ou erro
   */
  deleteUser(id: number): Observable<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(undefined);
    }
    return throwError(() => new Error(`Usuário com ID ${id} não encontrado`));
  }

  /**
   * Filtra usuários por tipo de associação
   * @param type Tipo de associação ('standard', 'premium', 'vip')
   * @returns Observable com lista de usuários filtrados
   */
  filterByMembershipType(type: 'standard' | 'premium' | 'vip'): Observable<User[]> {
    const filteredUsers = this.users.filter(u => u.membershipType === type);
    return of(filteredUsers);
  }
  /**
   * Filtra usuários por interesse
   * @param interest Interesse a ser pesquisado
   * @returns Observable com lista de usuários que possuem o interesse
   */
  filterByInterest(interest: string): Observable<User[]> {
    const filteredUsers = this.users.filter(u => u.interests.includes(interest));
    return of(filteredUsers);
  }

  /**
   * Busca usuários por nome ou email
   * @param query Termo de busca
   * @returns Observable com lista de usuários que correspondem à busca
   */
  searchUsers(query: string): Observable<User[]> {
    const normalizedQuery = query.toLowerCase().trim();
    const filteredUsers = this.users.filter(u => 
      u.name.toLowerCase().includes(normalizedQuery) || 
      u.email.toLowerCase().includes(normalizedQuery)
    );
    return of(filteredUsers);
  }
}

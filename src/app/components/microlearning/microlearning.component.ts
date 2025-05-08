import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-microlearning',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './microlearning.component.html',
  styleUrls: ['./microlearning.component.scss']
})
export class MicrolearningComponent {
  // Aqui podemos adicionar lógica para o componente, como acompanhar quais microlearnings foram concluídos
}

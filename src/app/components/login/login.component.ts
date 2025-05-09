import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/';

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    // redirecionar para home se já estiver logado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // obter URL de retorno dos parâmetros da rota ou usar '/' como padrão
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // getter para fácil acesso aos campos do formulário
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // parar aqui se o formulário for inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: (error: Error) => {
          this.error = error.message;
          this.loading = false;
        }
      });
  }
}

import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;  
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/';

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private seoService = inject(SeoService);

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
    
    // Configuração SEO
    this.seoService.updateAll({
      title: 'Login | Go Tech Talk | Acesse sua conta',
      description: 'Faça login na plataforma Go Tech Talk e tenha acesso a recursos exclusivos de aprendizado tecnológico para a melhor idade.',
      keywords: 'login tech talk, acesso plataforma, entrar, conta melhor idade',
      url: 'https://gotechtalks.com.br/login',
      type: 'website'
    });
  }

  ngOnDestroy(): void {
    // Remover qualquer JSON-LD que possa ter sido adicionado
    this.seoService.removeJsonLd();
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
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          this.error = 'Email ou senha incorretos';
          this.loading = false;
        }
      });
  }
}

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserLogin } from '../../../../core/interfaces/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { SpinnerButtonComponent } from '../../../../shared/spinner-button/spinner-button';
import { DefaultFormContainer } from '../../../../shared/default-form-container/default-form-container';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [
    DefaultFormContainer,
    RouterLink,
    ReactiveFormsModule, CommonModule, MatFormField, MatLabel, MatInput, MatError, SpinnerButtonComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  isLoading: boolean = false;
  form = new FormGroup({
    email: new FormControl<string>('', [Validators.email, Validators.required]),
    password: new FormControl<string>('', [Validators.required])

  })

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
  }


  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.authService.login(this.form.value as UserLogin).subscribe({
        next: () => {
          this.snackbar.open('Login realizado com sucesso!', 'Fechar', { duration: 3000 });
          this.isLoading = false;
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Erro ao realizar login:', error);
          const errorMessage = error?.error?.detail || 'Erro ao realizar login. Tente novamente.';
          this.snackbar.open(errorMessage, 'Fechar', { duration: 8000 });
          this.isLoading = false;
        }
      });
    }
  }

}
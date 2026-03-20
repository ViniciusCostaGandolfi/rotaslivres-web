import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { UserCreation, UserLogin } from '../../../../core/interfaces/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { SpinnerButtonComponent } from '../../../../shared/spinner-button/spinner-button';
import { DefaultFormContainer } from '../../../../shared/default-form-container/default-form-container';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { CommonModule } from '@angular/common';
import passwordMatchValidator from '../../../../core/validators/password-match.validator';

@Component({
  selector: 'app-sigin-page',
  imports: [
    DefaultFormContainer,
    RouterLink,
    ReactiveFormsModule, CommonModule, MatFormField, MatLabel, MatInput, MatError, SpinnerButtonComponent],
  templateUrl: './sigin-page.html',
  styleUrl: './sigin-page.css',
})
export class SiginPage {
  public isLoading = false;

  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', Validators.required),
    confirmPassword: new FormControl<string>('', Validators.required),
    phone: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)
    ]),
  }, { validators: passwordMatchValidator })




  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,

  ) { }



  onSubmit() {
    if (this.form.valid) {

      this.isLoading = true;
      this.authService.createUser(this.form.value as UserCreation).subscribe({
        next: () => {
          this.snackbar.open('Conta criada com sucesso!', 'Fechar', { duration: 3000 });
          this.isLoading = false;
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Erro ao criar conta. Tente novamente.';
          this.snackbar.open(errorMessage, 'Fechar', { duration: 8000 });
          this.isLoading = false;
        }
      });
    }
  }

  loginWithGoogle() {
    this.isLoading = true;


    console.log('Iniciar fluxo de login com Google');

    setTimeout(() => this.isLoading = false, 1000);
  }

  formatPhone() {
    let value = this.form.get('phone')?.value || '';

    value = value.replace(/\D/g, '');

    value = value.substring(0, 11);

    if (value.length > 0) {
      if (value.length <= 2) {
        value = `(${value}`;
      } else if (value.length <= 7) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      }
    }

    this.form.get('phone')?.setValue(value, { emitEvent: false });
  }
}

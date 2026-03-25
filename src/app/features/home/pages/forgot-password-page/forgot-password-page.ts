import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service/auth-service';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password-page.html',
  styleUrls: ['./forgot-password-page.css']
})
export class ForgotPasswordPage {
  email: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) { }

  onSubmit() {
    if (!this.email) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Se o e-mail existir na nossa base, um link de recuperação foi enviado.';
        this.email = '';
      },
      error: () => {
        this.isLoading = false;
        this.successMessage = 'Se o e-mail existir na nossa base, um link de recuperação foi enviado.';
      }
    });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { CurrentUserService } from '../../../../core/services/current-user-service/current-user-service';
import { TokenUserDto } from '../../../../core/interfaces/auth';
import { Subscription } from 'rxjs';
import { SpinnerButtonComponent } from '../../../../shared/spinner-button/spinner-button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDividerModule,
    SpinnerButtonComponent,
  ],
  templateUrl: './perfil-page.html',
  styleUrl: './perfil-page.css',
})
export class PerfilPage implements OnInit, OnDestroy {
  isLoading = false;
  userInitial = '';
  userRole = '';
  private userSub!: Subscription;

  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    email: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.email]),
  });

  constructor(
    private currentUserService: CurrentUserService,
    private snackbar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userSub = this.currentUserService.getUser().subscribe(tokenUser => {
      if (tokenUser?.user) {
        const u = tokenUser.user;
        this.form.patchValue({ name: u.name, email: u.email });
        this.userInitial = u.name?.charAt(0).toUpperCase() ?? '?';
        this.userRole = u.role === 'ROLE_ADMIN' ? 'Administrador' : 'Usuário';
      }
    });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  onSave() {
    if (this.form.valid) {
      this.isLoading = true;
      // TODO: call an API to update user profile
      setTimeout(() => {
        this.snackbar.open('Perfil atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }, 800);
    }
  }

  logout() {
    this.currentUserService.logout();
    this.router.navigate(['/login']);
  }
}

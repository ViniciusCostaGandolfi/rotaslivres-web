import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatDrawer, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrentUserService } from '../../../../core/services/current-user-service/current-user-service';
import { AdminRoute } from '../../../../core/interfaces/admin-route';
import { getRoutes } from '../../../../core/mocks/admin-routes';
import { Observable, Subscription } from 'rxjs';
import { TokenUserDto } from '../../../../core/interfaces/auth';
import { FooterComponent } from '../../../../shared/footer/footer.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FooterComponent
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout implements OnInit, OnDestroy {
  public routes: AdminRoute[] = [];
  public user$: Observable<TokenUserDto | null>;
  private userSub!: Subscription;

  constructor(
    private currentUserService: CurrentUserService,
    private router: Router
  ) {
    this.user$ = this.currentUserService.getUser();
  }

  ngOnInit() {
    this.userSub = this.user$.subscribe(user => {
      if (user && user.user) {
        this.routes = getRoutes(user.user);
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  logout() {
    this.currentUserService.logout();
    this.router.navigate(['/login']);
  }

  toggleDrawer(drawer: MatDrawer): void {
    drawer.toggle();
  }
}


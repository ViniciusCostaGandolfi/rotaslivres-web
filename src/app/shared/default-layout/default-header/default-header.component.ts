import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from "@angular/common";
import { map, filter } from 'rxjs';
import { mockDefaultRoutes } from '../../../core/mocks/default-routes';
import { MatDividerModule } from "@angular/material/divider";
import { ScrollToService } from '../../../core/scroll-to/scroll-to.service';
import { ScrollYService } from '../../../core/scroll-y/scroll-y.service';

@Component({
  selector: 'app-default-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    CommonModule,
    MatDividerModule
  ],
  templateUrl: './default-header.component.html',
  styleUrl: './default-header.component.css'
})
export class DefaultHeaderComponent implements OnInit {

  public mockDefaultRoutes = mockDefaultRoutes;
  public hasScrolled = false;
  public isHome = true;

  constructor(
    private scrollToService: ScrollToService,
    public scrollYservice: ScrollYService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.scrollYservice.scrollY$
      .pipe(map(scrollY => scrollY > 50))
      .subscribe(hasScrolled => {
        if (this.hasScrolled !== hasScrolled) {
          this.hasScrolled = hasScrolled;
          console.log(this.hasScrolled);
          this.cdr.detectChanges();
        }
      });

    this.checkUrl();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkUrl();
    });
  }

  private checkUrl() {
    this.isHome = this.router.url === '/' || this.router.url.startsWith('/#');
  }

  scrollToId(id: string) {
    this.scrollToService.scrollToElementById(id);
  }
}
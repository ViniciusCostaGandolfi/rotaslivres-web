import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIf, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface RouteItem {
  name: string;
  status: string;
  duration: string;
}

@Component({
  selector: 'app-rota-page',
  templateUrl: './rota-page.component.html',
  styleUrls: ['./rota-page.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, MatTableModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule]
})
export class RotaPageComponent implements OnInit {
  isLoading = false;
  hasError = false;

  dataSource = new MatTableDataSource<RouteItem>([
    { name: 'Rota Norte', status: 'COMPLETE', duration: '2h 30m' },
    { name: 'Rota Sul', status: 'PENDING', duration: '-' }
  ]);

  displayedColumns = ['name', 'status', 'duration', 'actions'];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goBack(): void {
    this.router.navigate(['/admin/rotas']);
  }
}
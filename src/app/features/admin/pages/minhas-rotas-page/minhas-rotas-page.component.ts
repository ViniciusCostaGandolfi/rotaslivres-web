import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { VrpService } from '../../../../core/services/vrp-service/vrp.service';
import { SolutionDto } from '../../../../core/interfaces/vrp/vrp';

@Component({
  selector: 'app-minhas-rotas-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule, MatSnackBarModule, RouterLink],
  templateUrl: './minhas-rotas-page.component.html',
  styleUrls: ['./minhas-rotas-page.component.css']
})
export class MinhasRotasPageComponent implements OnInit, OnDestroy {
  private vrpService = inject(VrpService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  dataSource = new MatTableDataSource<SolutionDto>([]);
  isLoading = signal(true);
  displayedColumns: string[] = ['id', 'status', 'createdAt', 'duration', 'actions'];
  pollInterval: any;

  ngOnInit() {
    this.fetchJobs();
    // Poll every 5 seconds
    this.pollInterval = setInterval(() => {
      this.fetchJobs();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  fetchJobs() {
    this.vrpService.getSolutions().subscribe({
      next: (data) => {
        this.dataSource.data = data || [];
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching jobs', err);
        this.isLoading.set(false);
      }
    });
  }

  viewRoute(job: SolutionDto) {
    this.router.navigate(['/admin/roterizacao', job.id]);
  }

  deleteRoute(id: number) {
    if (confirm('Tem certeza que deseja excluir esta roteirização?')) {
      this.vrpService.deleteSolution(id).subscribe({
        next: () => {
          this.fetchJobs();
          this.snackBar.open('Roteirização excluída com sucesso', 'Fechar', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error deleting job', err);
          this.snackBar.open('Erro ao excluir roteirização', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  reprocessRoute(id: number) {
    this.vrpService.retrySolution(id).subscribe({
      next: () => {
        this.fetchJobs();
        this.snackBar.open('Reprocessamento iniciado com sucesso', 'Fechar', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error reprocessing job', err);
        this.snackBar.open('Erro ao solicitar reprocessamento', 'Fechar', { duration: 3000 });
      }
    });
  }

  translateStatus(status: string): string {
    switch (status) {
      case 'PENDING': return 'PENDENTE';
      case 'RUNNING': return 'PROCESSANDO';
      case 'OPTIMAL': return 'CONCLUÍDO';
      case 'FEASIBLE': return 'CONCLUÍDO';
      case 'ERROR': return 'ERRO';
      case 'TIMEOUT': return 'TIMEOUT (ERRO)';
      case 'INFEASIBLE': return 'INVIÁVEL';
      default: return status;
    }
  }
}

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MapVrpModule } from '../../../../modules/map-vrp/map-vrp.module';
import { VrpService } from '../../../../core/services/vrp-service/vrp.service';
import { Vrp, SolutionDto, VrpIn } from '../../../../core/interfaces/vrp/vrp';
import { InputDataDialog } from '../../components/input-data-dialog/input-data-dialog';

@Component({
  selector: 'app-rota-page',
  templateUrl: './rota-page.component.html',
  styleUrls: ['./rota-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MapVrpModule
  ]
})
export class RotaPageComponent implements OnInit, OnDestroy {
  isLoading = true;
  hasError = false;
  errorMessage = '';
  isRunningAgain = false;
  isLoadingInput = false;

  vrpResult: Vrp | null = null;
  solutionMeta: SolutionDto | null = null;
  private pollInterval: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private vrpService: VrpService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchSolutionDetails(id);
    } else {
      this.hasError = true;
      this.errorMessage = 'ID Inválido';
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  fetchSolutionDetails(id: string) {
    this.vrpService.getSolution(id).subscribe({
      next: (job) => {
        this.solutionMeta = job;
        this.hasError = false;

        if (job.outputPath) {
          this.stopPolling();
          if (!this.vrpResult) { // Only fetch JSON if we don't have it yet
            this.fetchVrpJson(job.outputPath);
          } else {
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
          if (job.solverStatus === 'ERROR') {
            this.stopPolling();
            this.hasError = true;
            this.errorMessage = job.errorMessage || 'Falha na geração (Sem detalhes)';
          } else if (job.solverStatus === 'PENDING' || job.solverStatus === 'RUNNING') {
            this.startPolling(id);
          } else {
            // Finished but no output path?
            this.stopPolling();
            this.hasError = true;
            this.errorMessage = 'O processamento terminou porém nenhum resultado foi gerado.';
          }
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.stopPolling();
        this.hasError = true;
        this.errorMessage = 'Erro ao buscar detalhes da solução da API';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private startPolling(id: string) {
    if (this.pollInterval) return;
    this.pollInterval = setInterval(() => {
      this.fetchSolutionDetails(id);
    }, 5000);
  }

  private stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  fetchVrpJson(url: string) {
    this.vrpService.fetchVrpJson(url).subscribe({
      next: (vrp) => {
        this.vrpResult = vrp;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.hasError = true;
        this.errorMessage = 'Erro ao tentar baixar o JSON detalhado do Storage';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/roterizacao']);
  }

  openInputModal(): void {
    if (!this.solutionMeta?.inputPath) return;
    this.isLoadingInput = true;
    this.vrpService.fetchVrpInput(this.solutionMeta.inputPath).subscribe({
      next: (input: VrpIn) => {
        this.isLoadingInput = false;
        this.dialog.open(InputDataDialog, {
          data: input,
          width: '900px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          panelClass: 'input-data-panel'
        });
      },
      error: () => {
        this.isLoadingInput = false;
        this.snackBar.open('Erro ao carregar dados de entrada.', 'Fechar', { duration: 4000 });
      }
    });
  }

  runAgain(): void {
    if (!this.solutionMeta?.inputPath) return;
    this.isRunningAgain = true;
    this.vrpService.fetchVrpInput(this.solutionMeta.inputPath).subscribe({
      next: (input: VrpIn) => {
        this.isRunningAgain = false;
        this.router.navigate(['/admin/roterizacao/nova'], {
          state: {
            clients: input.clients,
            vehicles: input.vehicles,
            origin: input.origin
          }
        });
      },
      error: () => {
        this.isRunningAgain = false;
        this.snackBar.open('Erro ao carregar dados da roteirização anterior.', 'Fechar', { duration: 4000 });
      }
    });
  }

  retry(): void {
    if (!this.solutionMeta) return;
    this.isLoading = true;
    this.hasError = false;
    this.vrpService.retrySolution(this.solutionMeta.id).subscribe({
      next: () => {
        this.snackBar.open('Reprocessamento solicitado com sucesso!', 'Fechar', { duration: 3000 });
        this.fetchSolutionDetails(this.solutionMeta!.id.toString());
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erro ao solicitar reprocessamento', 'Fechar', { duration: 3000 });
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Não foi possível iniciar o reprocessamento.';
        this.cdr.markForCheck();
      }
    })
  }
}
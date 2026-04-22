import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MapVrpModule } from '../../../../modules/map-vrp/map-vrp.module';
import { VrpService } from '../../../../core/services/vrp-service/vrp.service';
import { Vrp, SolutionDto } from '../../../../core/interfaces/vrp/vrp';

@Component({
  selector: 'app-public-route-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MapVrpModule
  ],
  templateUrl: './public-route-page.page.html',
  styleUrl: './public-route-page.page.css',
})
export class PublicRoutePageComponent implements OnInit {
  isLoading = true;
  hasError = false;
  errorMessage = '';
  vrpResult: Vrp | null = null;
  solutionMeta: SolutionDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private vrpService: VrpService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const solutionId = this.route.snapshot.paramMap.get('solutionId');
    const routeIndex = this.route.snapshot.paramMap.get('routeIndex');

    if (solutionId && routeIndex !== null) {
      this.fetchSolutionDetails(solutionId, parseInt(routeIndex, 10));
    } else {
      this.hasError = true;
      this.errorMessage = 'Link incompleto';
      this.isLoading = false;
    }
  }

  fetchSolutionDetails(id: string, routeIdx: number) {
    this.vrpService.getPublicSolution(id).subscribe({
      next: (job) => {
        this.solutionMeta = job;
        if (job.outputPath) {
          this.fetchVrpJson(job.outputPath, routeIdx);
        } else {
          this.hasError = true;
          this.errorMessage = 'Resultado da rota ainda não disponível.';
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error(err);
        this.hasError = true;
        this.errorMessage = 'Não foi possível carregar os detalhes da rota.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  fetchVrpJson(url: string, routeIdx: number) {
    this.vrpService.fetchVrpJson(url).subscribe({
      next: (vrp) => {
        if (vrp.routes && vrp.routes[routeIdx]) {
          // Filter to show ONLY the requested route
          this.vrpResult = {
            ...vrp,
            routes: [vrp.routes[routeIdx]],
            unassignedClients: [] // Hide unassigned for public view
          };
        } else {
          this.hasError = true;
          this.errorMessage = 'Rota não encontrada nesta solução.';
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.hasError = true;
        this.errorMessage = 'Erro ao baixar dados do mapa.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}

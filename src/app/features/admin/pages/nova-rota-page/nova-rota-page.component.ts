import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf, DecimalPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VrpService } from '../../../../core/services/vrp-service/vrp.service';
import { ClientDto, VrpIn, Vrp, OriginDto } from '../../../../core/interfaces/vrp/vrp';
import { MapVrpModule } from '../../../../modules/map-vrp/map-vrp.module';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-nova-rota-page',
  templateUrl: './nova-rota-page.component.html',
  styleUrls: ['./nova-rota-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    MatProgressSpinner,
    MatButton,
    MatIcon,
    FormsModule,
    MapVrpModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatSnackBarModule
  ]
})
export class NovaRotaPageComponent implements OnInit {

  isLoading: boolean = false;
  isDragging: boolean = false;
  uploadedFile: File | null = null;
  vrpClients: ClientDto[] = [];
  vrpResult: Vrp | null = null;
  dataSource = new MatTableDataSource<ClientDto>([]);
  displayedColumns: string[] = ['index', 'postalCode', 'city', 'streetName', 'streetNumber', 'neighborhood', 'volumeLiters', 'weightKg'];

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) {
    if (value) {
      setTimeout(() => {
        this.dataSource.paginator = value;
      });
    }
  }

  @ViewChild(MatSort) set sort(value: MatSort) {
    if (value) {
      setTimeout(() => {
        this.dataSource.sort = value;
      });
    }
  }

  // VRP configs defaults
  maxRouteVolume: number = 45.0;
  maxRouteWeight: number = 450.0;
  maxRouteDistance: number = 100000.0;
  maxRouteDeliveries: number = 15;

  // Origin address fields
  originCep: string = '13480-000';
  originStreet: string = 'Rua Origem';
  originNumber: string = '100';
  originNeighborhood: string = 'Centro';
  originCity: string = 'Limeira';
  originState: string = 'SP';
  originLat: number = -22.56531;
  originLng: number = -47.40155;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private vrpService: VrpService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }


  downloadTemplate(): void {
    const csvContent = "volume_litros;peso_kg;cep;rua;numero;bairro;cidade;uf;latitude;longitude\n5.0;15.0;13480-123;Rua Exemplo;100;Centro;Limeira;SP;-22.56;-47.40\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modelo_clientes.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }

  handleFile(file: File): void {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      this.snackBar.open("Formato de arquivo inválido. Por favor, envie um arquivo .csv.", "Fechar", { duration: 5000 });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const clients = this.parseCSV(text);

      if (clients.length > 0) {
        this.vrpClients = clients;
        this.dataSource.data = clients;
        this.uploadedFile = file;

        // Inform Angular that the data has changed
        this.cdr.markForCheck();

        this.snackBar.open(`${this.vrpClients.length} clientes processados com sucesso!`, "Fechar", { duration: 3000 });
      } else {
        this.snackBar.open("O arquivo não conteve clientes válidos.", "Fechar", { duration: 4000 });
      }
    };
    reader.onerror = () => {
      this.snackBar.open("Erro ao ler arquivo CSV.", "Fechar", { duration: 5000 });
    };
    reader.readAsText(file);
  }

  private parseCSV(csvText: string): ClientDto[] {
    const tempClients: ClientDto[] = [];
    const lines = csvText.split('\n').filter(line => line.trim().length > 0);
    if (lines.length <= 1) return [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/[,;]/).map(p => p.trim());
      if (parts.length < 8) continue;

      const volumeLiters = parseFloat(parts[0]) || 0;
      const weightKg = parseFloat(parts[1]) || 0;
      const cep = parts[2];
      const streetName = parts[3];
      const streetNumber = parts[4];
      const neighborhood = parts[5];
      const city = parts[6];
      const state = parts[7];
      const latitude = parts.length > 8 ? parseFloat(parts[8]) : 0;
      const longitude = parts.length > 9 ? parseFloat(parts[9]) : 0;

      const client: ClientDto = {
        id: crypto.randomUUID(),
        volumeLiters: volumeLiters,
        weightKg: weightKg,
        createdAt: Math.floor(Date.now() / 1000),
        address: {
          formattedAddress: `${streetName}, ${streetNumber} - ${neighborhood}, ${city} - ${state}, ${cep}`,
          streetName: streetName,
          streetNumber: streetNumber,
          city: city,
          country: 'Brasil',
          postalCode: cep,
          neighborhood: neighborhood,
          complement: '',
          state: state,
          latitude: latitude,
          longitude: longitude
        }
      };
      tempClients.push(client);
    }
    return tempClients;
  }

  submitVrp(): void {
    if (this.vrpClients.length === 0) return;

    this.isLoading = true;

    const origin: OriginDto = {
      address: {
        formattedAddress: `${this.originStreet}, ${this.originNumber} - ${this.originNeighborhood}, ${this.originCity} - ${this.originState}, ${this.originCep}`,
        streetName: this.originStreet,
        streetNumber: this.originNumber,
        city: this.originCity,
        country: 'Brasil',
        postalCode: this.originCep,
        neighborhood: this.originNeighborhood,
        complement: '',
        state: this.originState,
        latitude: this.originLat,
        longitude: this.originLng
      }
    };

    const payload: VrpIn = {
      id: crypto.randomUUID(),
      origin: origin,
      clients: this.vrpClients,
      maxRouteVolume: this.maxRouteVolume,
      maxRouteDistance: this.maxRouteDistance,
      maxRouteWeight: this.maxRouteWeight,
      maxRouteDeliveries: this.maxRouteDeliveries
    };

    this.vrpService.createSolution(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open("Processamento iniciado com sucesso!", "Fechar", { duration: 5000 });
        this.router.navigate(['/admin/roterizacao']);
      },
      error: (err) => {
        console.error('Erro ao enviar VRP:', err);
        this.isLoading = false;
        this.snackBar.open("Erro ao iniciar roteirização. Verifique a API.", "Fechar", { duration: 5000 });
      }
    });
  }

  resetForm(): void {
    this.vrpResult = null;
    this.uploadedFile = null;
    this.vrpClients = [];
  }
}

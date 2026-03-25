import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf, DecimalPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VrpService } from '../../../../core/services/vrp-service/vrp.service';
import { ClientDto, VrpIn, Vrp, OriginDto, VehicleTypeDto } from '../../../../core/interfaces/vrp/vrp';
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

  // Clients Table
  dataSource = new MatTableDataSource<ClientDto>([]);
  displayedColumns: string[] = ['index', 'geoStatus', 'postalCode', 'state', 'city', 'streetName', 'streetNumber', 'neighborhood', 'volumeLiters', 'weightKg', 'latitude', 'longitude'];

  // Vehicles Table
  vehicleDataSource = new MatTableDataSource<VehicleTypeDto>([]);
  displayedVehicleColumns: string[] = ['name', 'volume', 'weight', 'deliveries', 'distance', 'minRoutes', 'maxRoutes', 'targetProportion', 'fixedCost', 'actions'];

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

  // VRP vehicles
  vehicles: VehicleTypeDto[] = [
    {
      id: crypto.randomUUID(),
      name: 'Fiorino Principal',
      maxVolumeLiters: 45.0,
      maxWeightKg: 450.0,
      maxDeliveries: 15,
      maxDistanceMeters: 100000.0,
      minRoutes: 0,
      maxRoutes: 1,
      targetProportion: 1.0,
      fixedCost: 50.0
    }
  ];

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

  ngOnInit(): void {
    this.vehicleDataSource.data = this.vehicles;
  }

  addVehicle() {
    this.vehicles.push({
      id: crypto.randomUUID(),
      name: 'Novo Veículo ' + (this.vehicles.length + 1),
      maxVolumeLiters: 45.0,
      maxWeightKg: 450.0,
      maxDeliveries: 15,
      maxDistanceMeters: 100000.0,
      minRoutes: 0,
      maxRoutes: 1,
      targetProportion: 0.0,
      fixedCost: 100.0
    });
    this.vehicleDataSource.data = this.vehicles;
  }

  removeVehicle(index: number) {
    if (this.vehicles.length > 1) {
      this.vehicles.splice(index, 1);
      this.vehicleDataSource.data = this.vehicles;
    }
  }

  // Helper de Endereço via Java Spring OpenCEP
  searchOriginCep() {
    const rawCep = this.originCep.replace(/\D/g, '');
    if (rawCep.length === 8) {
      this.vrpService.fetchCepData(rawCep).subscribe({
        next: (data) => {
          if (data && data.streetName) {
            this.originStreet = data.streetName;
            this.originNeighborhood = data.neighborhood;
            this.originCity = data.city;
            this.originState = data.state;
          }
        }
      });
    }
  }

  validateOriginAddress() {
    const q = `${this.originStreet}, ${this.originNeighborhood || ''}, ${this.originCity}, ${this.originState}`;
    const query = q.replace(/undefined/g, '').replace(/null/g, '');

    this.isLoading = true;
    this.vrpService.searchAddress(query).subscribe({
      next: (data) => {
        if (data && data.latitude) {
          this.originLat = data.latitude;
          this.originLng = data.longitude;
          this.snackBar.open("Coordenadas da Origem validadas com sucesso!", "Fechar", { duration: 3000 });
        } else {
          this.snackBar.open("Coordenadas não encontradas para a Origem via Nominatim.", "Fechar", { duration: 4000 });
        }
      },
      error: () => this.snackBar.open("Erro ao buscar coordenadas da Origem.", "Fechar", { duration: 4000 }),
      complete: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  hasMissingGeo(): boolean {
    return this.vrpClients.some(c => !c.address.latitude || c.address.latitude === 0);
  }

  validateAddresses() {
    this.isLoading = true;
    this.vrpService.enrichClientsBulk(this.vrpClients).subscribe({
      next: (enrichedClients) => {
        this.vrpClients = enrichedClients;
        this.dataSource.data = this.vrpClients;
        this.cdr.markForCheck();
        if (this.hasMissingGeo()) {
          this.snackBar.open("Algumas coordenadas não foram encontradas.", "Fechar", { duration: 4000 });
        } else {
          this.snackBar.open("Coordenadas validadas no Nominatim em lote!", "Fechar", { duration: 3000 });
        }
      },
      error: () => this.snackBar.open("Erro ao validar clientes no servidor.", "Fechar", { duration: 4000 }),
      complete: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }


  downloadClientTemplate(): void {
    const csvContent = "volume_litros;peso_kg;cep;rua;numero;bairro;cidade;uf;latitude;longitude\n5.0;15.0;13480-123;Rua Exemplo;100;Centro;Limeira;SP;-22.56;-47.40\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modelo_clientes.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadVehicleTemplate(): void {
    const csvContent = "nome;volume_max_l;peso_max_kg;max_entregas;max_distancia_m;min_rotas;max_rotas;proporcao_alvo;custo_fixo\nFiorino;800.0;1000.0;20;50000;0;5;0.8;400.0\nCaminhão Baú;3000.0;4000.0;15;100000;0;2;0.2;1500.0\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modelo_frota.csv';
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

  onVehicleFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleVehicleFile(input.files[0]);
    }
  }

  handleVehicleFile(file: File): void {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      this.snackBar.open("Formato de arquivo inválido. Envie um arquivo .csv.", "Fechar", { duration: 5000 });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedVehicles = this.parseVehicleCSV(text);
      if (parsedVehicles.length > 0) {
        this.vehicles = parsedVehicles;
        this.vehicleDataSource.data = this.vehicles;
        this.cdr.markForCheck();
        this.snackBar.open(`${this.vehicles.length} veículos carregados com sucesso!`, "Fechar", { duration: 3000 });
      } else {
        this.snackBar.open("O arquivo CSV de Frota não conteve veículos válidos.", "Fechar", { duration: 4000 });
      }
    };
    reader.readAsText(file);
  }

  private parseVehicleCSV(csvText: string): VehicleTypeDto[] {
    const tempVehicles: VehicleTypeDto[] = [];
    const lines = csvText.split('\n').filter(line => line.trim().length > 0);
    if (lines.length <= 1) return [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/[,;]/).map(p => p.trim());
      if (parts.length < 9) continue;

      tempVehicles.push({
        id: crypto.randomUUID(),
        name: parts[0],
        maxVolumeLiters: parseFloat(parts[1]) || 0,
        maxWeightKg: parseFloat(parts[2]) || 0,
        maxDeliveries: parseInt(parts[3], 10) || 0,
        maxDistanceMeters: parseFloat(parts[4]) || 0,
        minRoutes: parseInt(parts[5], 10) || 0,
        maxRoutes: parseInt(parts[6], 10) || 0,
        targetProportion: parseFloat(parts[7]) || 0,
        fixedCost: parseFloat(parts[8]) || 0
      });
    }
    return tempVehicles;
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

    if (this.hasMissingGeo()) {
      this.snackBar.open("Existem clientes sem coordenadas. Clique em 'Validar Endereços' antes de prosseguir.", "Fechar", { duration: 5000 });
      return;
    }

    if (!this.originLat || !this.originLng) {
      this.snackBar.open("A origem não possui coordenadas. Valide a origem primeiro.", "Fechar", { duration: 5000 });
      return;
    }

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
      vehicles: this.vehicles
    };

    this.vrpService.createSolution(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open("Roteirização enviada para a fila! Acompanhe em Minhas Rotas.", "Fechar", { duration: 5000 });
        this.router.navigate(['/admin/roteirizacao']);
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

import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import createColormap from 'colormap';
import { FullMerchantDto, ClientDto } from '../../../core/interfaces/vrp/vrp';
import { Vrp, VrpRoute, SolutionDto } from '../../../core/interfaces/vrp/vrp';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';
import { LngLatBounds } from 'maplibre-gl';


import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { MapVrpRouteComponent } from './map-vrp-route/map-vrp-route.component';
import { MapVrpMerchantComponent } from './map-vrp-merchant/map-vrp-merchant.component';


@Component({
  selector: 'app-map-vrp',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    RouterModule,
    NgxMapLibreGLModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSidenavModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDividerModule,
    MatSelectModule,
    MatFormFieldModule,
    MapVrpRouteComponent,
    MapVrpMerchantComponent
  ],
  templateUrl: './map-vrp.component.html',
  styleUrls: ['./map-vrp.component.css']
})
export class MapVrpComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('map') map!: MapComponent;

  public showNav = false;
  public showMap = false
  public center: [number, number] = [-47.402459, -22.571489];
  public colormap: string[] = [];
  public merchant: FullMerchantDto | null = null;
  public selectedRouteIds: Set<number> = new Set<number>();
  public hoveredRouteId: number | null = null;
  public selectionMode: 'individual' | 'all' = 'individual';



  @Input() public vrp!: Vrp;
  @Input() public solutionMeta: SolutionDto | null = null;

  constructor(private cdr: ChangeDetectorRef) { }

  get totalDistance(): number {
    if (!this.vrp) return 0;
    return (this.vrp.routes || []).reduce((acc, r) => acc + (r.distanceMeters || 0), 0);
  }

  get totalWeight(): number {
    if (!this.vrp) return 0;
    return (this.vrp.routes || []).reduce((acc, r) => acc + (r.weightKg || 0), 0);
  }

  get totalVolume(): number {
    if (!this.vrp) return 0;
    return (this.vrp.routes || []).reduce((acc, r) => acc + (r.volumeLiters || 0), 0);
  }

  get totalClients(): number {
    if (!this.vrp) return 0;
    return (this.vrp.routes || []).reduce((acc, r) => acc + (r.clients?.length || 0), 0);
  }

  get unassignedCount(): number {
    return this.vrp?.unassignedClients?.length || 0;
  }

  toggleNav() {
    this.showNav = !this.showNav;
  }

  ngOnInit(): void {
    this.updateMap()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vrp'] && !changes['vrp'].isFirstChange()) {
      this.updateMap();
    }
  }

  onRouteButtonClick(route: VrpRoute) {
    this.toggleRoute(route.id);

    if (route.routeLine && route.routeLine.length > 0) {
      const bounds = new LngLatBounds();
      let hasCoords = false;
      route.routeLine.forEach(coord => {
        if (coord.lng != null && coord.lat != null) {
          bounds.extend([coord.lng, coord.lat]);
          hasCoords = true;
        }
      });

      if (hasCoords && this.map?.mapInstance) {
        this.map.mapInstance.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
          duration: 1000
        });
      }
    }
  }

  toggleRoute(routeId: number) {
    if (this.selectedRouteIds.has(routeId)) {
      this.selectedRouteIds.delete(routeId);
    } else {
      this.selectedRouteIds.add(routeId);
    }
    this.updateSelectionMode();
    this.cdr.detectChanges();
  }

  toggleAllRoutes(selectAll: boolean) {
    if (selectAll) {
      this.vrp.routes.forEach(r => this.selectedRouteIds.add(r.id));
      this.selectionMode = 'all';
    } else {
      this.selectedRouteIds.clear();
      this.selectionMode = 'individual';
    }
    this.cdr.detectChanges();
  }

  onSelectionModeChange(mode: 'individual' | 'all') {
    this.selectionMode = mode;
    if (mode === 'all') {
      this.toggleAllRoutes(true);
    } else {
      this.toggleAllRoutes(false);
    }
  }

  private updateSelectionMode() {
    if (this.vrp?.routes?.length > 0 && this.selectedRouteIds.size === this.vrp.routes.length) {
      this.selectionMode = 'all';
    } else {
      this.selectionMode = 'individual';
    }
  }

  onUnassignedClientClick(client: ClientDto) {
    if (client.address.longitude != null && client.address.latitude != null) {
      this.center = [client.address.longitude, client.address.latitude];
    }
  }

  onRouteHover(routeId: number | null) {
    this.hoveredRouteId = routeId;
  }

  isRouteHighlighted(routeId: number): boolean {
    if (this.vrp?.routes?.length === 1) return true;
    return this.hoveredRouteId === routeId || this.selectedRouteIds.has(routeId);
  }

  isRouteDimmed(routeId: number): boolean {
    // Agora não "apagamos" o resto, as rotas selecionadas ficam grossas e as outras default.
    // Mas mantemos a lógica de hover para destaque temporário se necessário.
    return false;
  }


  private updateMap(): void {
    // Resetamos o mapa para forçar o re-render
    this.showMap = false;
    this.cdr.detectChanges();

    setTimeout(() => {
      // Verifique se o nome do campo é 'origin' ou 'merchant' no seu JSON da API
      if (this.vrp && this.vrp.origin?.address) {
        const addr = this.vrp.origin.address;

        if (addr.longitude != null && addr.latitude != null) {
          this.center = [addr.longitude, addr.latitude];
        }

        try {
          this.colormap = createColormap<"hex">({
            alpha: 1,
            colormap: "rainbow",
            nshades: this.vrp.routes.length > 9 ? this.vrp.routes.length + 1 : 9,
            format: "hex",
          });
        } catch (e) {
          console.error("Erro ao gerar colormap", e);
          this.colormap = this.vrp.routes.map(() => '#3b82f6'); // fallback azul
        }

        this.showMap = true;
      } else {
        this.showMap = true;
      }
      this.cdr.detectChanges();

      if (this.vrp?.routes?.length === 1) {
        setTimeout(() => {
          this.onRouteButtonClick(this.vrp.routes[0]);
        }, 500);
      }
    }, 300);
  }
}


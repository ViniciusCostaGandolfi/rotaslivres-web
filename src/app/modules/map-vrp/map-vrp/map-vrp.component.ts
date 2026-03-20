import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import createColormap from 'colormap';
import { FullMerchantDto } from '../../../core/interfaces/vrp/vrp';
import { Vrp, VrpRoute, SolutionDto } from '../../../core/interfaces/vrp/vrp';


@Component({
  selector: 'app-map-vrp',
  standalone: false,
  templateUrl: './map-vrp.component.html',
  styleUrls: ['./map-vrp.component.css']
})
export class MapVrpComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  public showNav = false;
  public showMap = false
  public center: [number, number] = [-47.402459, -22.571489];
  public colormap: string[] = [];
  public merchant: FullMerchantDto | null = null;
  public selectedRoute: VrpRoute | null = null;



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
    this.selectedRoute = route;
    const midPoint = this.selectedRoute.routeLine[Math.ceil(this.selectedRoute.routeLine.length / 2)];
    if (midPoint && midPoint.lng != null && midPoint.lat != null) {
      this.center = [midPoint.lng, midPoint.lat];
    }
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
        console.warn("VRP carregado, mas 'origin.address' está faltando. Verifique a estrutura do JSON.");
        // Se não tiver origem, tentamos mostrar o mapa mesmo assim centralizando no primeiro ponto
        this.showMap = true;
      }

      this.cdr.detectChanges(); // <--- O PULO DO GATO ESTÁ AQUI
    }, 300); // Reduzi para 300ms para ser mais rápido
  }
}


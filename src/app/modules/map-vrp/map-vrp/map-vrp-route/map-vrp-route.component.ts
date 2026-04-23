import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { CoordinateDto, VrpRoute } from '../../../../core/interfaces/vrp/vrp';
import { MapComponent, NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { CommonModule } from '@angular/common';
import { MapVrpOrderComponent } from '../map-vrp-order/map-vrp-order.component';

@Component({
  selector: 'app-map-vrp-route',
  standalone: true,
  imports: [CommonModule, NgxMapLibreGLModule, MapVrpOrderComponent],
  templateUrl: './map-vrp-route.component.html',
  styleUrl: './map-vrp-route.component.scss'
})
export class MapVrpRouteComponent implements OnChanges {
  public geometry: GeoJSON.GeometryObject = {
    type: 'LineString',
    coordinates: [],
  };

  @Input() public route!: VrpRoute;
  @Input() public color!: string;
  @Input() public selected: boolean = false;
  @Input() public highlighted: boolean = false;
  @Input() public dimmed: boolean = false;
  @Input() public map!: MapComponent;
  @Output() public routeSelected = new EventEmitter<VrpRoute>();

  public paint: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['route'] && this.route) {
        this.updateGeometry();
    }
    if (changes['color'] && this.color) {
        this.updatePaint();
    }
    if (changes['highlighted'] || changes['dimmed'] || changes['selected']) {
        this.updatePaint();
    }
  }

  private updateGeometry(): void {
    const coordinates = this.route.routeLine
      .filter((coord: CoordinateDto) => coord.lng != null && coord.lat != null)
      .map((coord: CoordinateDto) => [coord.lng as number, coord.lat as number]);
    this.geometry = {
      type: 'LineString',
      coordinates: coordinates,
    };
  }

  private updatePaint(): void {
    let lineWidth = 4;
    let lineOpacity = 0.6;

    if (this.highlighted || this.selected) {
        lineWidth = 8;
        lineOpacity = 1.0;
    }

    this.paint = {
        'line-color': this.color,
        'line-width': lineWidth,
        'line-opacity': lineOpacity
    };
  }
  
  public toggleRouteSelection(): void {
    this.selected = !this.selected;
    this.updatePaint();
    this.routeSelected.emit(this.route);
  }

  changeCursor(cursorType: string) {
    const map = this.map;
    if (map) {
      map.mapInstance.getCanvas().style.cursor = cursorType;
    }
  }
}

import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { CoordinateDto, VrpRoute } from '../../../../core/interfaces/vrp/vrp';
import { Map } from 'maplibre-gl';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';

@Component({
  selector: 'app-map-vrp-route',
  standalone: false,
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
    this.paint = {
        'line-color': this.color,
        'line-width': this.selected ? 6 : 3,
        'line-opacity': this.selected ? 0.8 : 0.5
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

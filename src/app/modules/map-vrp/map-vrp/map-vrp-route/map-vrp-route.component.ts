import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CoordinateDto, VrpRoute } from '../../../../core/interfaces/vrp/vrp';

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
        'line-width': 3,
        'line-opacity': 0.5
    };
  }
}

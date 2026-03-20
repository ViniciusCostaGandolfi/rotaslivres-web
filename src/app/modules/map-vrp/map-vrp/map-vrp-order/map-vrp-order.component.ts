import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MarkerComponent } from '@maplibre/ngx-maplibre-gl';
import { VrpClient } from '../../../../core/interfaces/vrp/vrp';

@Component({
  selector: 'app-map-vrp-order',
  standalone: false,
  templateUrl: './map-vrp-order.component.html',
  styleUrl: './map-vrp-order.component.scss'
})
export class MapVrpOrderComponent implements OnChanges {
  public point: [number, number] = [-47.402459, -22.571489];
  public hasError = false;
  
  @Input() public order!: VrpClient;
  marker: MarkerComponent|undefined;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order'] && this.order) {
      this.point = [this.order.address.longitude, this.order.address.latitude];
    }
  }

  onError() {
    this.hasError = true;
  }
}
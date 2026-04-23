import { CommonModule } from '@angular/common';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MarkerComponent } from '@maplibre/ngx-maplibre-gl';

@Component({
  selector: 'app-map-vrp-order',
  standalone: true,
  imports: [CommonModule, NgxMapLibreGLModule, MatTooltipModule],
  templateUrl: './map-vrp-order.component.html',
  styleUrl: './map-vrp-order.component.scss'
})
export class MapVrpOrderComponent implements OnChanges {
  public point: [number, number] = [-47.402459, -22.571489];
  public hasError = false;
  
  @Input() public order!: any;
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
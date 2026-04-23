import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VrpOrigin } from '../../../../core/interfaces/vrp/vrp';

@Component({
  selector: 'app-map-vrp-merchant',
  standalone: true,
  imports: [CommonModule, NgxMapLibreGLModule, MatTooltipModule],
  templateUrl: './map-vrp-merchant.component.html',
  styleUrl: './map-vrp-merchant.component.scss'
})
export class MapVrpMerchantComponent implements OnChanges  {
  
  public point:[number, number] = [-46.402459, -21.571489]
  public hasError = false;
  
  @Input() public base!: VrpOrigin; 
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['base'] && this.base) {
      this.point = [this.base.address.longitude, this.base.address.latitude];
    }
  }

  onError() {
    this.hasError = true;
  }
}

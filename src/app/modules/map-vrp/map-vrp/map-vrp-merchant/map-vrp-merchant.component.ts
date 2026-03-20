import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { VrpOrigin } from '../../../../core/interfaces/vrp/vrp';

@Component({
  selector: 'app-map-vrp-merchant',
  standalone: false,
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

import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MapVrpComponent } from './map-vrp/map-vrp.component';
import { MapVrpRouteComponent } from './map-vrp/map-vrp-route/map-vrp-route.component';
import { MapVrpOrderComponent } from './map-vrp/map-vrp-order/map-vrp-order.component';
import { MapVrpMerchantComponent } from './map-vrp/map-vrp-merchant/map-vrp-merchant.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    // All components are now standalone
  ],
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
    MapVrpComponent,
    MapVrpRouteComponent,
    MapVrpMerchantComponent,
    MapVrpOrderComponent,
  ],
  exports: [
    MapVrpComponent,
    MapVrpRouteComponent,
    MapVrpMerchantComponent,
    MapVrpOrderComponent,
  ]
})
export class MapVrpModule { }

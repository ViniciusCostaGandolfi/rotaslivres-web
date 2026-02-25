import { Component } from '@angular/core';
import { DefaultHeaderComponent } from './default-header/default-header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    DefaultHeaderComponent,
    CommonModule,
    RouterModule
],
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {

}

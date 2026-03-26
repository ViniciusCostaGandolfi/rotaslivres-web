import { Component, Inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { VrpIn } from '../../../../core/interfaces/vrp/vrp';

@Component({
  selector: 'app-input-data-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './input-data-dialog.html',
  styleUrl: './input-data-dialog.css',
})
export class InputDataDialog {
  clientsColumns = ['index', 'address', 'city', 'volume', 'weight', 'coords'];
  vehicleColumns = ['name', 'volume', 'weight', 'deliveries', 'distance', 'routes', 'cost'];

  constructor(
    public dialogRef: MatDialogRef<InputDataDialog>,
    @Inject(MAT_DIALOG_DATA) public data: VrpIn
  ) { }
}


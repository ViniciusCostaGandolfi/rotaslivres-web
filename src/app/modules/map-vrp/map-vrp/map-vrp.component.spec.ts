import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';

import { MapVrpComponent } from './map-vrp.component';

describe('MapVrpComponent', () => {
  let component: MapVrpComponent;
  let fixture: ComponentFixture<MapVrpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapVrpComponent],
      imports: [
        CommonModule,
        DecimalPipe,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatDividerModule,
        MatListModule,
        MatTooltipModule,
        MatExpansionModule,
        MatSelectModule,
        MatFormFieldModule,
        RouterModule.forRoot([]),
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapVrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

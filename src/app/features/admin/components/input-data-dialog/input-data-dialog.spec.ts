import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDataDialog } from './input-data-dialog';

describe('InputDataDialog', () => {
  let component: InputDataDialog;
  let fixture: ComponentFixture<InputDataDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputDataDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputDataDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

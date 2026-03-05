import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultFormContainer } from './default-form-container';

describe('DefaultFormContainer', () => {
  let component: DefaultFormContainer;
  let fixture: ComponentFixture<DefaultFormContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultFormContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultFormContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

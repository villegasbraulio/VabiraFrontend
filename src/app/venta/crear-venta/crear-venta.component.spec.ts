import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearVentaComponent } from './crear-venta.component';

describe('CrearVentaComponent', () => {
  let component: CrearVentaComponent;
  let fixture: ComponentFixture<CrearVentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearVentaComponent]
    });
    fixture = TestBed.createComponent(CrearVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

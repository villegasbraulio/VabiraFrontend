import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselResponsiveDemo } from './carousel.component';

describe('CarouselResponsiveDemo', () => {
  let component: CarouselResponsiveDemo;
  let fixture: ComponentFixture<CarouselResponsiveDemo>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarouselResponsiveDemo]
    });
    fixture = TestBed.createComponent(CarouselResponsiveDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

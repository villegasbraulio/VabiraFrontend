import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangeModalComponent } from './time-range-modal.component';

describe('TimeRangeModalComponent', () => {
  let component: TimeRangeModalComponent;
  let fixture: ComponentFixture<TimeRangeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeRangeModalComponent]
    });
    fixture = TestBed.createComponent(TimeRangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

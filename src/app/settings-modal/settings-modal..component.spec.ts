import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsModalComponent } from './settings-modal..component';

describe('SettingsModalComponent', () => {
  let component: SettingsModalComponent;
  let fixture: ComponentFixture<SettingsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsModalComponent]
    });
    fixture = TestBed.createComponent(SettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

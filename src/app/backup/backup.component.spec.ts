import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupComponent } from './backup.component';

describe('BackupComponent', () => {
  let component: BackupComponent;
  let fixture: ComponentFixture<BackupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackupComponent]
    });
    fixture = TestBed.createComponent(BackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

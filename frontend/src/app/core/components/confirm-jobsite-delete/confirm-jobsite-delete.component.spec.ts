import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmJobsiteDeleteComponent } from './confirm-jobsite-delete.component';

describe('ConfirmJobsiteDeleteComponent', () => {
  let component: ConfirmJobsiteDeleteComponent;
  let fixture: ComponentFixture<ConfirmJobsiteDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmJobsiteDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmJobsiteDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

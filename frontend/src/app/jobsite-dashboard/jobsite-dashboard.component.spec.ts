import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatDialogModule } from '@angular/material/dialog';

import { JobsiteDashboardComponent } from './jobsite-dashboard.component';

describe('JobsiteDashboardComponent', () => {
  let component: JobsiteDashboardComponent;
  let fixture: ComponentFixture<JobsiteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule],
      declarations: [JobsiteDashboardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsiteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

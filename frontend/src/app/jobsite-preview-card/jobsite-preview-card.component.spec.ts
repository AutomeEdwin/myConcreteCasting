import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Jobsite } from '../models/jobsite.model';

import { JobsitePreviewCardComponent } from './jobsite-preview-card.component';

describe('JobsitePreviewCardComponent', () => {
  let component: JobsitePreviewCardComponent;
  let fixture: ComponentFixture<JobsitePreviewCardComponent>;
  const jobsite = new Jobsite(
    1,
    'owner',
    'name',
    'address',
    'coordinates',
    'description',
    'castings'
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobsitePreviewCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsitePreviewCardComponent);
    component = fixture.componentInstance;
    component.jobsite = jobsite;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

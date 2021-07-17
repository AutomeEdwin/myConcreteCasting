import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Jobsite } from '../models/jobsite.model';
import { Router } from '@angular/router';

import { JobsitePreviewCardComponent } from './jobsite-preview-card.component';

describe('JobsitePreviewCardComponent', () => {
  let component: JobsitePreviewCardComponent;
  let fixture: ComponentFixture<JobsitePreviewCardComponent>;
  let router: Router;

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
      imports: [RouterTestingModule],
      declarations: [JobsitePreviewCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsitePreviewCardComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.jobsite = jobsite;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

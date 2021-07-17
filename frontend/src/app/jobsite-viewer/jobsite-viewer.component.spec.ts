import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { routes } from '../app-routing.module';
import { JobsiteViewerComponent } from './jobsite-viewer.component';
import { Jobsite } from '../models/jobsite.model';

describe('JobsiteViewerComponent', () => {
  let component: JobsiteViewerComponent;
  let fixture: ComponentFixture<JobsiteViewerComponent>;
  let router: Router;

  const jobsite: Jobsite = new Jobsite(
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
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [JobsiteViewerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsiteViewerComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.jobsite = jobsite;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

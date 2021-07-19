import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { routes } from '../app-routing.module';
import { JobsiteViewerComponent } from './jobsite-viewer.component';
import { Jobsite } from '../models/jobsite.model';
import { Casting } from '../models/casting.model';

describe('JobsiteViewerComponent', () => {
  let component: JobsiteViewerComponent;
  let fixture: ComponentFixture<JobsiteViewerComponent>;
  let router: Router;

  let castingsArray: Array<Casting> = [
    new Casting('name', 'description', 'infos'),
  ];
  const jobsite: Jobsite = new Jobsite(
    1,
    'owner',
    'name',
    'address',
    [0, 0],
    'description',
    castingsArray
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

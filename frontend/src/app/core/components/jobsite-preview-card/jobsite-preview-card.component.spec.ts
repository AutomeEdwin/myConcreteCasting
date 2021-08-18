import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Jobsite } from '../../models/jobsite.model';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { JobsitePreviewCardComponent } from './jobsite-preview-card.component';
import { Casting } from '../../models/casting.model';
import { Weather } from '../../models/weather.model';

describe('JobsitePreviewCardComponent', () => {
  let component: JobsitePreviewCardComponent;
  let fixture: ComponentFixture<JobsitePreviewCardComponent>;
  let router: Router;

  let castingsArray: Array<Casting> = [
    new Casting(
      'fqs4d56f4qds65f',
      'name',
      'description',
      true,
      0.2,
      false,
      0.2,
      'oversulfated cement',
      "C20_25",
      new Date(),
      new Date()
    ),
  ];
  const jobsite = new Jobsite(
    1,
    1,
    'name',
    'address',
    [0, 0],
    'description',
    castingsArray
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
      declarations: [JobsitePreviewCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsitePreviewCardComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.jobsite = jobsite;
    component.weather = new Weather('clear sky', '01d', 7, 100, 1, 1.5);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

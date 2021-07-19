import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Jobsite } from '../models/jobsite.model';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { JobsitePreviewCardComponent } from './jobsite-preview-card.component';
import { Casting } from '../models/casting.model';

describe('JobsitePreviewCardComponent', () => {
  let component: JobsitePreviewCardComponent;
  let fixture: ComponentFixture<JobsitePreviewCardComponent>;
  let router: Router;

  let castingsArray: Array<Casting> = [
    new Casting('name', 'description', 'infos'),
  ];
  const jobsite = new Jobsite(
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
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
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

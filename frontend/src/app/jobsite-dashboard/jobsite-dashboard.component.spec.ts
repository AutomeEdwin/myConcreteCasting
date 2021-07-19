import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatDialogModule } from '@angular/material/dialog';

import { JobsiteDashboardComponent } from './jobsite-dashboard.component';
import { Jobsite } from '../models/jobsite.model';
import { Casting } from '../models/casting.model';

describe('JobsiteDashboardComponent', () => {
  let component: JobsiteDashboardComponent;
  let fixture: ComponentFixture<JobsiteDashboardComponent>;
  let castingsArray: Array<Casting> = [
    new Casting('name', 'description', 'infos'),
  ];

  let jobsite = new Jobsite(
    1,
    'owner',
    'name',
    'address',
    [0, 0],
    'description',
    castingsArray
  );

  let jobsitesArray: Array<Jobsite> = [jobsite, jobsite];

  const requestResponse = [
    {
      id: 12,
      jobsite_owner: 'test@test.com',
      jobsite_name: 'test',
      jobsite_address:
        '16, Rue de la Loi, Quartier Royal, Pentagon, Brussels, City of Brussels, Brussels-Capital, 1000, Belgium',
      jobsite_coordinates: '[4.3665285, 50.8461624]',
      jobsite_description: 'dsqdsqd',
      jobsite_castings:
        '[{"casting_name": "dsqdsqcxwcwx", "casting_description": "aezaeazeae", "casting_infos": "wxcwxcwxc"}]',
    },
    {
      id: 13,
      jobsite_owner: 'test@test.com',
      jobsite_name: 'dsfds',
      jobsite_address: 'fdsfdsf',
      jobsite_coordinates: '[4.254469203264735, 50.893171073773544]',
      jobsite_description: 'fdsfsfsfds',
      jobsite_castings:
        '[{"casting_name": "rzerz", "casting_description": "dfsfsf", "casting_infos": "cxwcxwcxw"}]',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule],
      declarations: [JobsiteDashboardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsiteDashboardComponent);
    component = fixture.componentInstance;
    component.jobsiteArray = jobsitesArray;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    const navbar = compiled.querySelector('app-navbar');
    const newJobsiteButton = compiled.querySelector(
      'button[id="newJobsiteButton"]'
    );
    const refreshButton = compiled.querySelector('button[id="refreshButton"]');
    const cardsGrid = compiled.querySelector('div[id="cards"]');

    expect(navbar).toBeTruthy();
    expect(newJobsiteButton).toBeTruthy();
    expect(refreshButton).toBeTruthy();
    expect(cardsGrid).toBeTruthy();
  });

  it('should get one jobsite', () => {
    const jobsite = component.getJobsite(0);

    expect(jobsite).toBe(jobsitesArray[0]);
  });

  it('should fill jobsites array', () => {
    component.fillJobsitesArray(requestResponse);
    expect(component.jobsiteArray.length).toBe(2);
    expect(component.jobsiteArray[0].getCastings().length).toBe(1);
    expect(component.jobsiteArray[1].getCastings().length).toBe(1);
  });
});

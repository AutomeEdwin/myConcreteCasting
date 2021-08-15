import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { routes } from '../../../app-routing.module';
import { JobsiteViewerComponent } from './jobsite-viewer.component';
import { Jobsite } from '../../models/jobsite.model';
import { Casting } from '../../models/casting.model';
import { Weather } from '../../models/weather.model';

describe('JobsiteViewerComponent', () => {
  let component: JobsiteViewerComponent;
  let fixture: ComponentFixture<JobsiteViewerComponent>;

  let weather = new Weather('clear sky', '01d', 7, 100, 1, 1.5);

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
      new Date(),
      new Date()
    ),
  ];
  const jobsite: Jobsite = new Jobsite(
    1,
    1,
    'name',
    'address',
    [0, 0],
    'description',
    castingsArray
  );

  const apiRes = {
    id: 2,
    owner: 1,
    name: 'josbite 1',
    address:
      '16, Rue de la Loi, Quartier Royal, Pentagon, Brussels, City of Brussels, Brussels-Capital, 1000, Belgium',
    coordinates: '[4.3665285, 50.8461624]',
    description: 'description jobsite',
    castings:
      '[{"id": "0f3a4dce-f0fb-4397-8320-08e5119d6c52", "name": "casting 1", "description": "description casting 1", "isClassEI": "True", "fcm2_fcm28_ratio": "None", "type2_addition": "False", "rc2_rc28_ratio": "None", "cement_type": "CEM 2/A-M ou -V 42.5 N ou R ou 32.5 R", "curing_start": "2021-08-15T13:05:28.295000", "curing_end": "2021-08-16T01:05:28.295000"}, {"id": "5971a6bc-16e7-4a27-a835-9ed1591d5316", "name": "casting 2", "description": "descriotppn casting 2", "isClassEI": "False", "fcm2_fcm28_ratio": "None", "type2_addition": "False", "rc2_rc28_ratio": "None", "cement_type": "oversulfated cement", "curing_start": "2021-08-15T16:12:35.260000", "curing_end": "2021-08-25T16:12:35.260000"}]',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [JobsiteViewerComponent],
    }).compileComponents();
    localStorage.setItem(
      'user',
      '{"id":1,"firstName":"test","lastName":"test","email":"test@test.com"}'
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsiteViewerComponent);
    component = fixture.componentInstance;
    component.jobsite = jobsite;
    component.weather = weather;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should create a jobsite with it's castings", () => {
    component.createJobsite(apiRes);
    let castingsArray: Array<Casting> = [];
    let castings = JSON.parse(apiRes.castings);

    for (let j in castings) {
      let casting = new Casting(
        castings[j].id,
        castings[j].name,
        castings[j].description,
        castings[j].isClassEI,
        castings[j].fcm2_fcm28_ratio,
        castings[j].type2_addition,
        castings[j].rc2_rc28_ratio,
        castings[j].cement_type,
        castings[j].curing_start,
        castings[j].curing_end
      );
      castingsArray.push(casting);
    }

    let testJobsite = new Jobsite(
      apiRes.id,
      apiRes.owner,
      apiRes.name,
      apiRes.address,
      JSON.parse(apiRes.coordinates),
      apiRes.description,
      castingsArray
    );

    expect(component.jobsite).toEqual(testJobsite);
  });
});

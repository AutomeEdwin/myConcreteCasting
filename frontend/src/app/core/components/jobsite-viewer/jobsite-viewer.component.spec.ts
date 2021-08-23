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
      'CEM 52.5 N',
      'C20_25',
      new Date().getTime(),
      43200,
      1630101
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
      '[{"id": "fcc3e2ce-0130-489a-a906-bc37ca89bb24", "name": "eazeaz", "description": "eazea", "isClassEI": "True", "fcm2_fcm28_ratio": "None", "type2_addition": "False", "rc2_rc28_ratio": "None", "cement_type": "CEM 52.5 N", "strength_class": "C25_30", "casting_start": "1629669600", "curing_duration": "43200", "hardening_duration": "1630101"}, {"id": "22de2e21-81aa-4c7c-8517-c205b8b1b303", "name": "ezaezaea", "description": "eazeaz", "isClassEI": "False", "fcm2_fcm28_ratio": "None", "type2_addition": "False", "rc2_rc28_ratio": "None", "cement_type": "CEM 42.5 N", "strength_class": "C20_25", "casting_start": "1629756000", "curing_duration": "259200", "hardening_duration": "9016436"}]',
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
        castings[j].strength_class,
        Number(castings[j].casting_start),
        Number(castings[j].curing_duration),
        Number(castings[j].hardening_duration)
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

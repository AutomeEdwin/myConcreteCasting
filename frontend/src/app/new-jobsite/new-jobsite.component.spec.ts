import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NewJobsiteComponent } from './new-jobsite.component';

describe('NewJobsiteComponent', () => {
  let component: NewJobsiteComponent;
  let fixture: ComponentFixture<NewJobsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [NewJobsiteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewJobsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    const jobsite_nameInput = compiled.querySelector(
      'input[id="jobsite_name"]'
    );
    const jobsite_addressInput = compiled.querySelector(
      'input[id="jobsite_address"]'
    );
    const map = compiled.querySelector('div[id="map"]');
    const jobsite_descriptionInput = compiled.querySelector(
      'textarea[id="jobsite_description"]'
    );
    const casting_nameInput = compiled.querySelector(
      'input[id="casting_name"]'
    );
    const casting_descriptionInput = compiled.querySelector(
      'textarea[id="casting_description"]'
    );
    const casting_infosInput = compiled.querySelector(
      'textarea[id="casting_infos"]'
    );

    const jobsite_overview = compiled.querySelector(
      'div[id="jobsite_overview"]'
    );

    const castings_overview = compiled.querySelector(
      'div[id="castings_overview"]'
    );

    expect(jobsite_nameInput).toBeTruthy();
    expect(jobsite_addressInput).toBeTruthy();
    expect(map).toBeTruthy();
    expect(jobsite_descriptionInput).toBeTruthy();
    expect(casting_nameInput).toBeTruthy();
    expect(casting_descriptionInput).toBeTruthy();
    expect(casting_infosInput).toBeTruthy();
    expect(jobsite_overview).toBeTruthy();
    expect(castings_overview).toBeTruthy();
  });

  it('should test form validity', () => {
    const form = component.form;
    const jobsite_owner = form.controls.jobsite_owner;
    const jobsite_nameInput = form.controls.jobsite_name;
    const jobsite_addressInput = form.controls.jobsite_address;
    const jobsite_coordinates = form.controls.jobsite_coordinates;
    const jobsite_descriptionInput = form.controls.jobsite_description;

    //const casting_nameInput = form.controls.castings;
    //const casting_descriptionInput = form.get('casting_description');
    //const casting_infosInput = form.get('casting_infos');

    expect(form.valid).toBeFalsy();

    jobsite_owner.setValue('test');
    jobsite_nameInput.setValue('myjobsitename');
    jobsite_addressInput.setValue('myjobsiteaddress');
    jobsite_coordinates.setValue([0, 0]);
    jobsite_descriptionInput.setValue('jobsitedescription');

    //expect(form.valid).toBeTruthy();
  });

  it('should test input validity', () => {});

  it('should test input errors', () => {});

  it('should submit the form', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    const button = fixture.debugElement.nativeElement.querySelector(
      'button[id="submit"]'
    );
    button.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
  }));
});

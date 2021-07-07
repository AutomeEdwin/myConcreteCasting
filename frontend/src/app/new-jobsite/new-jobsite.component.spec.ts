import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormArray, ReactiveFormsModule } from '@angular/forms';

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

  // TEST THE FORM ITSELF
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

    const castingForm = form.controls.jobsite_castings;

    expect(form.valid).toBeFalsy();

    jobsite_owner.setValue('test');
    jobsite_nameInput.setValue('myjobsitename');
    jobsite_addressInput.setValue('myjobsiteaddress');
    jobsite_coordinates.setValue([0, 0]);
    jobsite_descriptionInput.setValue('jobsitedescription');
    castingForm.setValue([
      {
        casting_name: 'casting_name',
        casting_description: 'casting_description',
        casting_infos: 'casting_infos',
      },
    ]);

    expect(form.valid).toBeTruthy();
  });

  it('should test input validity', () => {
    const form = component.form;
    const jobsite_nameInput = form.controls.jobsite_name;
    const jobsite_addressInput = form.controls.jobsite_address;

    const castingsForm = form.get('jobsite_castings') as FormArray;
    const casting0 = castingsForm.controls[0];
    const casting_nameInput = casting0.get('casting_name');
    const casting_infosInput = casting0.get('casting_infos');

    expect(jobsite_nameInput.valid).toBeFalsy();
    expect(jobsite_addressInput.valid).toBeFalsy();
    expect(casting_nameInput?.valid).toBeFalsy();
    expect(casting_infosInput?.valid).toBeFalsy();

    jobsite_nameInput.setValue('jobsite name');
    jobsite_addressInput.setValue('jobsite_address');
    casting_nameInput?.setValue('casting_name');
    casting_infosInput?.setValue('casting_infos');

    expect(jobsite_nameInput.valid).toBeTruthy();
    expect(jobsite_addressInput.valid).toBeTruthy();
    expect(casting_nameInput?.valid).toBeTruthy();
    expect(casting_infosInput?.valid).toBeTruthy();
  });

  it('should submit the form', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    const button = fixture.debugElement.nativeElement.querySelector(
      'button[id="submit"]'
    );
    button.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  // TEST COMPONENT LOGIC
  it('should get form control', () => {
    expect(component.f).toEqual(component.form.controls);
  });

  it('should get casting controls', () => {
    expect(component.getCastingsControls).toEqual(
      <FormArray>component.form.get('jobsite_castings')
    );
  });

  it('should get jobsite values', () => {
    const form = component.form;
    const jobsite_nameInput = form.controls.jobsite_name;
    const jobsite_addressInput = form.controls.jobsite_address;
    const jobsite_coordinates = form.controls.jobsite_coordinates;
    const jobsite_descriptionInput = form.controls.jobsite_description;

    jobsite_nameInput.setValue('myjobsitename');
    jobsite_addressInput.setValue('myjobsiteaddress');
    jobsite_coordinates.setValue([0, 0]);
    jobsite_descriptionInput.setValue('jobsitedescription');

    expect(component.getJobsite('jobsite_name')).toEqual('myjobsitename');
    expect(component.getJobsite('jobsite_address')).toEqual('myjobsiteaddress');
    expect(component.getJobsite('jobsite_coordinates')).toEqual(
      jobsite_coordinates.value
    );
    expect(component.getJobsite('jobsite_description')).toEqual(
      'jobsitedescription'
    );
  });

  it('should get casting values', () => {
    component.form.controls.jobsite_castings.setValue([
      {
        casting_name: 'casting_name',
        casting_description: 'casting_description',
        casting_infos: 'casting_infos',
      },
    ]);

    expect(component.getCasting(0, 'casting_name')).toEqual('casting_name');
    expect(component.getCasting(0, 'casting_description')).toEqual(
      'casting_description'
    );
    expect(component.getCasting(0, 'casting_infos')).toEqual('casting_infos');
  });

  it('should add a new casting to the jobsite', () => {
    const form = component.form;
    let castingsArray = form.get('jobsite_castings') as FormArray;

    expect(castingsArray.length).toEqual(1);

    component.addConcreteCasting();

    expect(castingsArray.length).toEqual(2);
  });

  it('should remove a casting from the jobsite', () => {
    const form = component.form;
    const castingForm = form.controls.jobsite_castings;
    component.addConcreteCasting();
    component.addConcreteCasting();

    castingForm.setValue([
      {
        casting_name: '1',
        casting_description: '1',
        casting_infos: '1',
      },
      {
        casting_name: '2',
        casting_description: '2',
        casting_infos: '2',
      },
      {
        casting_name: '3',
        casting_description: '3',
        casting_infos: '3',
      },
    ]);

    component.removeConcreteCasting(1);

    let x = form.get('jobsite_castings') as FormArray;

    expect(x.length).toEqual(2);
    expect(x.value).toEqual([
      {
        casting_name: '1',
        casting_description: '1',
        casting_infos: '1',
      },
      {
        casting_name: '3',
        casting_description: '3',
        casting_infos: '3',
      },
    ]);
  });

  it('should know if there is only one casting in the jobsite', () => {
    const form = component.form;
    let castingsArray = form.get('jobsite_castings') as FormArray;

    expect(component.isLastArea()).toBeTruthy();

    component.addConcreteCasting();

    expect(component.isLastArea()).toBeFalsy();

    component.removeConcreteCasting(castingsArray.length);
  });

  // TODO test angular material components
  // TODO test map
});

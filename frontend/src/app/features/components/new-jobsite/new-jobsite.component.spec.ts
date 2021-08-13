import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { NewJobsiteComponent } from './new-jobsite.component';

describe('NewJobsiteComponent', () => {
  let component: NewJobsiteComponent;
  let fixture: ComponentFixture<NewJobsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSelectModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatInputModule,
        NoopAnimationsModule,
        BrowserDynamicTestingModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
      declarations: [NewJobsiteComponent],
    }).compileComponents();
    localStorage.setItem(
      'user',
      '{"id":1,"firstName":"test","lastName":"test","email":"test@test.com"}'
    );
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
    const map = compiled.querySelector('div[id="new-jobsite-map"]');
    const jobsite_descriptionInput = compiled.querySelector(
      'textarea[id="jobsite_description"]'
    );
    const casting_nameInput = compiled.querySelector(
      'input[id="casting_name"]'
    );
    const casting_descriptionInput = compiled.querySelector(
      'textarea[id="casting_description"]'
    );

    const casting_isClassEIInput = compiled.querySelector(
      'textarea[id="casting_isClassEI"]'
    );

    const casting_fcm2_fcm28_ratioInput = compiled.querySelector(
      'textarea[id="casting_fcm2_fcm28_ratio"]'
    );

    const casting_type2_additionInput = compiled.querySelector(
      'textarea[id="casting_type2_addition"]'
    );
    const casting_rc2_rc28_ratioInput = compiled.querySelector(
      'textarea[id="casting_rc2_rc28_ratio"]'
    );
    const casting_cement_typeInput = compiled.querySelector(
      'textarea[id="casting_cement_type"]'
    );

    const jobsite_overview = compiled.querySelector(
      'div[id="jobsite_overview"]'
    );

    const castings_overview = compiled.querySelector(
      'div[id="castings_overview"]'
    );

    component.ngAfterViewInit();

    expect(jobsite_nameInput).toBeTruthy();
    expect(jobsite_addressInput).toBeTruthy();
    expect(map).toBeTruthy();
    expect(jobsite_descriptionInput).toBeTruthy();
    expect(casting_nameInput).toBeTruthy();
    expect(casting_descriptionInput).toBeTruthy();
    expect(casting_isClassEIInput).toBeFalsy();
    expect(casting_fcm2_fcm28_ratioInput).toBeFalsy();
    expect(casting_type2_additionInput).toBeFalsy();
    expect(casting_rc2_rc28_ratioInput).toBeFalsy();
    expect(casting_cement_typeInput).toBe(null);
    expect(jobsite_overview).toBeTruthy();
    expect(castings_overview).toBeTruthy();
  });

  it('should test form validity', () => {
    const newJobsiteForm = component.newJobsiteForm;
    const owner = newJobsiteForm.controls.owner;
    const jobsite_nameInput = newJobsiteForm.controls.jobsite_name;
    const jobsite_addressInput = newJobsiteForm.controls.jobsite_address;
    const jobsite_coordinates = newJobsiteForm.controls.jobsite_coordinates;
    const jobsite_descriptionInput =
      newJobsiteForm.controls.jobsite_description;

    const castingForm = newJobsiteForm.controls.jobsite_castings;

    expect(newJobsiteForm.valid).toBeFalsy();

    owner.setValue('1');
    jobsite_nameInput.setValue('myjobsitename');
    jobsite_addressInput.setValue('myjobsiteaddress');
    jobsite_coordinates.setValue([0, 0]);
    jobsite_descriptionInput.setValue('jobsitedescription');
    castingForm.setValue([
      {
        casting_name: 'casting_name',
        casting_description: 'casting_description',
        casting_isClassEI: false,
        casting_fcm2_fcm28_ratio: null,
        casting_type2_addition: false,
        casting_rc2_rc28_ratio: null,
        casting_cement_type: 'oversulfated cement',
      },
    ]);

    expect(newJobsiteForm.valid).toBeTruthy();
  });

  it('should test input validity', () => {
    const newJobsiteForm = component.newJobsiteForm;
    const jobsite_nameInput = newJobsiteForm.controls.jobsite_name;
    const jobsite_addressInput = newJobsiteForm.controls.jobsite_address;

    const castingsForm = newJobsiteForm.get('jobsite_castings') as FormArray;
    const casting0 = castingsForm.controls[0];
    const casting_nameInput = casting0.get('casting_name');
    const casting_isClassEIInput = casting0.get('casting_isClassEI');
    const casting_fcm2_fcm28_ratioInput = casting0.get(
      'casting_fcm2_fcm28_ratio'
    );
    const casting_type2_additionInput = casting0.get('casting_type2_addition');
    const casting_rc2_rc28_ratioInput = casting0.get('casting_rc2_rc28_ratio');
    const casting_cement_typeInput = casting0.get('casting_cement_type');

    expect(jobsite_nameInput.valid).toBeFalsy();
    expect(jobsite_addressInput.valid).toBeFalsy();
    expect(casting_nameInput?.valid).toBeFalsy();
    expect(casting_isClassEIInput?.valid).toBeTruthy();
    expect(casting_fcm2_fcm28_ratioInput?.valid).toBeTruthy();
    expect(casting_type2_additionInput?.valid).toBeTruthy();
    expect(casting_rc2_rc28_ratioInput?.valid).toBeTruthy();
    expect(casting_cement_typeInput?.valid).toBeFalsy();

    jobsite_nameInput.setValue('jobsite name');
    jobsite_addressInput.setValue('jobsite_address');
    casting_nameInput?.setValue('casting_name');
    casting_isClassEIInput?.setValue('casting_infos');
    casting_fcm2_fcm28_ratioInput?.setValue('casting_infos');
    casting_type2_additionInput?.setValue('casting_infos');
    casting_rc2_rc28_ratioInput?.setValue('casting_infos');
    casting_cement_typeInput?.setValue('casting_infos');

    expect(jobsite_nameInput.valid).toBeTruthy();
    expect(jobsite_addressInput.valid).toBeTruthy();
    expect(casting_nameInput?.valid).toBeTruthy();
    expect(casting_isClassEIInput?.valid).toBeTruthy();
    expect(casting_fcm2_fcm28_ratioInput?.valid).toBeTruthy();
    expect(casting_type2_additionInput?.valid).toBeTruthy();
    expect(casting_rc2_rc28_ratioInput?.valid).toBeTruthy();
    expect(casting_cement_typeInput?.valid).toBeTruthy();
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
    expect(component.f).toEqual(component.newJobsiteForm.controls);
  });

  it('should get casting controls', () => {
    expect(component.getCastingsControls).toEqual(
      <FormArray>component.newJobsiteForm.get('jobsite_castings')
    );
  });

  it('should get jobsite values', () => {
    const newJobsiteForm = component.newJobsiteForm;
    const jobsite_nameInput = newJobsiteForm.controls.jobsite_name;
    const jobsite_addressInput = newJobsiteForm.controls.jobsite_address;
    const jobsite_coordinates = newJobsiteForm.controls.jobsite_coordinates;
    const jobsite_descriptionInput =
      newJobsiteForm.controls.jobsite_description;

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
    component.newJobsiteForm.controls.jobsite_castings.setValue([
      {
        casting_name: 'casting_name',
        casting_description: 'casting_description',
        casting_isClassEI: false,
        casting_fcm2_fcm28_ratio: null,
        casting_type2_addition: false,
        casting_rc2_rc28_ratio: null,
        casting_cement_type: 'oversulfated cement',
      },
    ]);

    expect(component.getCasting(0, 'casting_name')).toEqual('casting_name');
    expect(component.getCasting(0, 'casting_description')).toEqual(
      'casting_description'
    );
    expect(component.getCasting(0, 'casting_isClassEI')).toBeFalse();
    expect(component.getCasting(0, 'casting_fcm2_fcm28_ratio')).toBeNull();
    expect(component.getCasting(0, 'casting_type2_addition')).toBeFalse();
    expect(component.getCasting(0, 'casting_rc2_rc28_ratio')).toBeNull();
    expect(component.getCasting(0, 'casting_cement_type')).toBe(
      'oversulfated cement'
    );
  });

  it('should add a new casting to the jobsite', () => {
    const newJobsiteForm = component.newJobsiteForm;
    let castingsArray = newJobsiteForm.get('jobsite_castings') as FormArray;

    expect(castingsArray.length).toEqual(1);

    component.addConcreteCasting();

    expect(castingsArray.length).toEqual(2);
  });

  it('should remove a casting from the jobsite', () => {
    const newJobsiteForm = component.newJobsiteForm;
    const castingForm = newJobsiteForm.controls.jobsite_castings;
    component.addConcreteCasting();
    component.addConcreteCasting();

    castingForm.setValue([
      {
        casting_name: 'casting_name1',
        casting_description: 'casting_description',
        casting_isClassEI: false,
        casting_fcm2_fcm28_ratio: null,
        casting_type2_addition: false,
        casting_rc2_rc28_ratio: null,
        casting_cement_type: 'oversulfated cement',
      },
      {
        casting_name: 'casting_name2',
        casting_description: 'casting_description',
        casting_isClassEI: false,
        casting_fcm2_fcm28_ratio: null,
        casting_type2_addition: false,
        casting_rc2_rc28_ratio: null,
        casting_cement_type: 'oversulfated cement',
      },
      {
        casting_name: 'casting_name3',
        casting_description: 'casting_description',
        casting_isClassEI: false,
        casting_fcm2_fcm28_ratio: null,
        casting_type2_addition: false,
        casting_rc2_rc28_ratio: null,
        casting_cement_type: 'oversulfated cement',
      },
    ]);

    component.removeConcreteCasting(1);

    let x = newJobsiteForm.get('jobsite_castings') as FormArray;

    expect(x.length).toEqual(2);
    expect(x.value).toEqual([
      {
        casting_name: 'casting_name1',
        casting_description: 'casting_description',
        casting_isClassEI: false,
        casting_fcm2_fcm28_ratio: null,
        casting_type2_addition: false,
        casting_rc2_rc28_ratio: null,
        casting_cement_type: 'oversulfated cement',
      },
      {
        casting_name: 'casting_name3',
        casting_description: 'casting_description',
        casting_isClassEI: false,
        casting_fcm2_fcm28_ratio: null,
        casting_type2_addition: false,
        casting_rc2_rc28_ratio: null,
        casting_cement_type: 'oversulfated cement',
      },
    ]);
  });

  it('should know if there is only one casting in the jobsite', () => {
    const newJobsiteForm = component.newJobsiteForm;
    let castingsArray = newJobsiteForm.get('jobsite_castings') as FormArray;

    expect(component.isLastArea()).toBeTruthy();

    component.addConcreteCasting();

    expect(component.isLastArea()).toBeFalsy();

    component.removeConcreteCasting(castingsArray.length);
  });
});

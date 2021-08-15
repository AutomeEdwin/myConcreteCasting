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
    const nameInput = compiled.querySelector('input[id="name"]');
    const addressInput = compiled.querySelector('input[id="address"]');
    const map = compiled.querySelector('div[id="new-jobsite-map"]');
    const jobsite_descriptionInput = compiled.querySelector(
      'textarea[id="jobsite_description"]'
    );
    const casting_nameInput = compiled.querySelector('input[id="name"]');
    const casting_descriptionInput = compiled.querySelector(
      'textarea[id="casting_description"]'
    );

    const casting_isClassEIInput = compiled.querySelector(
      'textarea[id="isClassEI"]'
    );

    const casting_fcm2_fcm28_ratioInput = compiled.querySelector(
      'textarea[id="fcm2_fcm28_ratio"]'
    );

    const casting_type2_additionInput = compiled.querySelector(
      'textarea[id="type2_addition"]'
    );
    const casting_rc2_rc28_ratioInput = compiled.querySelector(
      'textarea[id="rc2_rc28_ratio"]'
    );
    const casting_cement_typeInput = compiled.querySelector(
      'textarea[id="cement_type"]'
    );

    const jobsite_overview = compiled.querySelector(
      'div[id="jobsite_overview"]'
    );

    const castings_overview = compiled.querySelector(
      'div[id="castings_overview"]'
    );

    component.ngAfterViewInit();

    expect(nameInput).toBeTruthy();
    expect(addressInput).toBeTruthy();
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
    const nameInput = newJobsiteForm.controls.name;
    const addressInput = newJobsiteForm.controls.address;
    const coordinates = newJobsiteForm.controls.coordinates;
    const descriptionInput = newJobsiteForm.controls.description;

    const castingForm = newJobsiteForm.controls.castings;

    expect(newJobsiteForm.valid).toBeFalsy();

    owner.setValue('1');
    nameInput.setValue('myjobsitename');
    addressInput.setValue('myjobsiteaddress');
    coordinates.setValue([0, 0]);
    descriptionInput.setValue('jobsitedescription');
    castingForm.setValue([
      {
        name: 'casting_name',
        description: 'casting_description',
        isClassEI: false,
        fcm2_fcm28_ratio: null,
        type2_addition: false,
        rc2_rc28_ratio: null,
        cement_type: 'oversulfated cement',
      },
    ]);

    expect(newJobsiteForm.valid).toBeTruthy();
  });

  it('should test input validity', () => {
    const newJobsiteForm = component.newJobsiteForm;
    const nameInput = newJobsiteForm.controls.name;
    const addressInput = newJobsiteForm.controls.address;

    const castingsForm = newJobsiteForm.get('castings') as FormArray;
    const casting0 = castingsForm.controls[0];
    const casting_nameInput = casting0.get('name');
    const casting_isClassEIInput = casting0.get('isClassEI');
    const casting_fcm2_fcm28_ratioInput = casting0.get('fcm2_fcm28_ratio');
    const casting_type2_additionInput = casting0.get('type2_addition');
    const casting_rc2_rc28_ratioInput = casting0.get('rc2_rc28_ratio');
    const casting_cement_typeInput = casting0.get('cement_type');

    expect(nameInput.valid).toBeFalsy();
    expect(addressInput.valid).toBeFalsy();
    expect(casting_nameInput?.valid).toBeFalsy();
    expect(casting_isClassEIInput?.valid).toBeTruthy();
    expect(casting_fcm2_fcm28_ratioInput?.valid).toBeTruthy();
    expect(casting_type2_additionInput?.valid).toBeTruthy();
    expect(casting_rc2_rc28_ratioInput?.valid).toBeTruthy();
    expect(casting_cement_typeInput?.valid).toBeFalsy();

    nameInput.setValue('jobsite name');
    addressInput.setValue('address');
    casting_nameInput?.setValue('name');
    casting_isClassEIInput?.setValue('isClassEI');
    casting_fcm2_fcm28_ratioInput?.setValue('fcm2_fcm28_ratio');
    casting_type2_additionInput?.setValue('type2_addition');
    casting_rc2_rc28_ratioInput?.setValue('rc2_rc28_ratio');
    casting_cement_typeInput?.setValue('cement_type');

    expect(nameInput.valid).toBeTruthy();
    expect(addressInput.valid).toBeTruthy();
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
      <FormArray>component.newJobsiteForm.get('castings')
    );
  });

  it('should get jobsite values', () => {
    const newJobsiteForm = component.newJobsiteForm;
    const nameInput = newJobsiteForm.controls.name;
    const addressInput = newJobsiteForm.controls.address;
    const coordinates = newJobsiteForm.controls.coordinates;
    const descriptionInput = newJobsiteForm.controls.description;

    nameInput.setValue('myjobsitename');
    addressInput.setValue('myjobsiteaddress');
    coordinates.setValue([0, 0]);
    descriptionInput.setValue('jobsitedescription');

    expect(component.getJobsite('name')).toEqual('myjobsitename');
    expect(component.getJobsite('address')).toEqual('myjobsiteaddress');
    expect(component.getJobsite('coordinates')).toEqual(coordinates.value);
    expect(component.getJobsite('description')).toEqual('jobsitedescription');
  });

  it('should get casting values', () => {
    component.newJobsiteForm.controls.castings.setValue([
      {
        name: 'name',
        description: 'description',
        isClassEI: false,
        fcm2_fcm28_ratio: null,
        type2_addition: false,
        rc2_rc28_ratio: null,
        cement_type: 'oversulfated cement',
      },
    ]);

    expect(component.getCasting(0, 'name')).toEqual('name');
    expect(component.getCasting(0, 'description')).toEqual('description');

    expect(component.getCasting(0, 'isClassEI')).toBeFalse();
    expect(component.getCasting(0, 'fcm2_fcm28_ratio')).toBeNull();
    expect(component.getCasting(0, 'type2_addition')).toBeFalse();
    expect(component.getCasting(0, 'rc2_rc28_ratio')).toBeNull();
    expect(component.getCasting(0, 'cement_type')).toBe('oversulfated cement');
  });

  it('should add a new casting to the jobsite', () => {
    const newJobsiteForm = component.newJobsiteForm;
    let castingsArray = newJobsiteForm.get('castings') as FormArray;

    expect(castingsArray.length).toEqual(1);

    component.addConcreteCasting();

    expect(castingsArray.length).toEqual(2);
  });

  it('should remove a casting from the jobsite', () => {
    const newJobsiteForm = component.newJobsiteForm;
    const castingForm = newJobsiteForm.controls.castings;
    component.addConcreteCasting();
    component.addConcreteCasting();

    castingForm.setValue([
      {
        name: 'name1',
        description: 'description',
        isClassEI: false,
        fcm2_fcm28_ratio: null,
        type2_addition: false,
        rc2_rc28_ratio: null,
        cement_type: 'oversulfated cement',
      },
      {
        name: 'name2',
        description: 'description',
        isClassEI: false,
        fcm2_fcm28_ratio: null,
        type2_addition: false,
        rc2_rc28_ratio: null,
        cement_type: 'oversulfated cement',
      },
      {
        name: 'name3',
        description: 'description',
        isClassEI: false,
        fcm2_fcm28_ratio: null,
        type2_addition: false,
        rc2_rc28_ratio: null,
        cement_type: 'oversulfated cement',
      },
    ]);

    component.removeConcreteCasting(1);

    let x = newJobsiteForm.get('castings') as FormArray;

    expect(x.length).toEqual(2);
    expect(x.value).toEqual([
      {
        name: 'name1',
        description: 'description',
        isClassEI: false,
        fcm2_fcm28_ratio: null,
        type2_addition: false,
        rc2_rc28_ratio: null,
        cement_type: 'oversulfated cement',
      },
      {
        name: 'name3',
        description: 'description',
        isClassEI: false,
        fcm2_fcm28_ratio: null,
        type2_addition: false,
        rc2_rc28_ratio: null,
        cement_type: 'oversulfated cement',
      },
    ]);
  });

  it('should know if there is only one casting in the jobsite', () => {
    const newJobsiteForm = component.newJobsiteForm;
    let castingsArray = newJobsiteForm.get('castings') as FormArray;

    expect(component.isLastArea()).toBeTruthy();

    component.addConcreteCasting();

    expect(component.isLastArea()).toBeFalsy();

    component.removeConcreteCasting(castingsArray.length);
  });
});

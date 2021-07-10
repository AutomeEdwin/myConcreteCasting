import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputHarness } from '@angular/material/input/testing';

import { RegisterComponent } from './register.component';
import { routes } from '../app-routing.module';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let location: Location;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [RegisterComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    location = TestBed.inject(Location);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TEST THE FORM ITSELF
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    const firstNameInput = compiled.querySelector('input[id="firstName"]');
    const lastNameInput = compiled.querySelector('input[id="lastName"]');
    const emailInput = compiled.querySelector('input[id="email"]');
    const passwordInput = compiled.querySelector('input[id="password"]');
    const passwordConfirmInput = compiled.querySelector(
      'input[id="passwordConfirm"]'
    );
    const submitButton = compiled.querySelector('.signUpBtn');
    const signInButton = compiled.querySelector('.signInBtn');

    expect(firstNameInput).toBeTruthy();
    expect(lastNameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(passwordConfirmInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(signInButton).toBeTruthy();
  });

  it('should test form validity', () => {
    const form = component.form;
    const firstNameInput = form.controls.firstName;
    const lastNameInput = form.controls.lastName;
    const emailInput = form.controls.email;
    const passwordInput = form.controls.password;
    const passwordConfirmInput = form.controls.passwordConfirm;

    expect(form.valid).toBeFalsy();

    firstNameInput.setValue('John');
    lastNameInput.setValue('Doe');
    emailInput.setValue('testMail@gmail.com');
    passwordInput.setValue('12345678');
    passwordConfirmInput.setValue('12345678');

    expect(form.valid).toBeTruthy();
  });

  it('should test input validity', () => {
    const form = component.form;
    const firstNameInput = form.controls.firstName;
    const lastNameInput = form.controls.lastName;
    const emailInput = form.controls.email;
    const passwordInput = form.controls.password;
    const passwordConfirmInput = form.controls.passwordConfirm;

    expect(firstNameInput.valid).toBeFalsy();
    expect(lastNameInput.valid).toBeFalsy();
    expect(emailInput.valid).toBeFalsy();
    expect(passwordInput.valid).toBeFalsy();
    expect(passwordConfirmInput.valid).toBeFalsy();

    firstNameInput.setValue('John');
    lastNameInput.setValue('Doe');
    emailInput.setValue('testMail@gmail.com');
    passwordInput.setValue('123456789');
    passwordConfirmInput.setValue('123456789');

    expect(firstNameInput.valid).toBeTruthy();
    expect(lastNameInput.valid).toBeTruthy();
    expect(emailInput.valid).toBeTruthy();
    expect(passwordInput.valid).toBeTruthy();
    expect(passwordConfirmInput.valid).toBeTruthy();
  });

  it('should test input errors', () => {
    const form = component.form;
    const firstNameInput = form.controls.firstName;
    const lastNameInput = form.controls.lastName;
    const emailInput = form.controls.email;
    const passwordInput = form.controls.password;
    const passwordConfirmInput = form.controls.passwordConfirm;

    expect(firstNameInput.errors).toBeTruthy();
    expect(lastNameInput.errors).toBeTruthy();
    expect(emailInput.errors).toBeTruthy();
    expect(passwordInput.errors).toBeTruthy();
    expect(passwordConfirmInput.errors).toBeTruthy();

    firstNameInput.setValue('John');
    lastNameInput.setValue('Doe');
    emailInput.setValue('testMail@gmail.com');
    passwordInput.setValue('123456789');
    passwordConfirmInput.setValue('123456789');
    expect(firstNameInput.errors).toBeNull();
    expect(lastNameInput.errors).toBeNull();
    expect(emailInput.errors).toBeNull();
    expect(passwordInput.errors).toBeNull();
    expect(passwordConfirmInput.errors).toBeNull();

    emailInput.setValue('not a valid email address');
    passwordInput.setValue('1');
    expect(emailInput.errors?.email).toBeTruthy();
    expect(passwordInput.errors?.minlength).toBeTruthy();

    passwordInput.setValue('my password');
    passwordConfirmInput.setValue('not the same password');
    expect(passwordConfirmInput.errors?.mustMatch).toBeTruthy();
  });

  it('should submit the form', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should create the request body', () => {
    const form = component.form;
    const firstNameInput = form.controls.firstName;
    const lastNameInput = form.controls.lastName;
    const emailInput = form.controls.email;
    const passwordInput = form.controls.password;

    firstNameInput.setValue('John');
    lastNameInput.setValue('Doe');
    emailInput.setValue('testMail@gmail.com');
    passwordInput.setValue('12345678');

    const expectedJson = JSON.stringify({
      first_name: 'John',
      last_name: 'Doe',
      email: 'testMail@gmail.com',
      password: '12345678',
    });

    expect(component.makeRequestBody(component.form)).toEqual(expectedJson);
  });

  it('should test request response', fakeAsync(() => {
    let APIResponse = {
      status: 200,
      message: 'User created sucessfully',
    };

    component.handleHttpResponse(APIResponse);

    tick();

    expect(location.path()).toBe('');
  }));

  it('should navigate to /login from this component', () => {
    router.navigate(['login']).then(() => {
      expect(location.path()).toBe('/login');
    });
  });

  it("shouldn't be able to access dashboard from this component", () => {
    router.navigate(['dashboard']).then(() => {
      expect(location.path()).toBe('/login');
    });
  });
});

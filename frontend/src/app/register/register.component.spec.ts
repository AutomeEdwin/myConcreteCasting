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

import { RegisterComponent } from './register.component';
import { routes } from '../app-routing.module';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [RegisterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    location = TestBed.inject(Location);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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
    const submitButton = compiled.querySelector('button');
    const link = compiled.querySelector('a');

    expect(firstNameInput).toBeTruthy();
    expect(lastNameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(passwordConfirmInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(link).toBeTruthy();
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
    expect(firstNameInput.errors).toBeNull();

    lastNameInput.setValue('Doe');
    expect(lastNameInput.errors).toBeNull();

    emailInput.setValue('testMail@gmail.com');
    expect(emailInput.errors).toBeNull();

    passwordInput.setValue('123456789');
    expect(passwordInput.errors).toBeNull();

    passwordConfirmInput.setValue('123456789');
    expect(passwordConfirmInput.errors).toBeNull();
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
      success: true,
      message: 'User created sucessfully',
    };

    component.handleHttpResponse(APIResponse);

    tick();

    expect(location.path()).toBe('/login');
  }));

  it('should navigate to /login', () => {
    router.navigate(['login']).then(() => {
      expect(location.path()).toBe('/login');
    });
  });
});

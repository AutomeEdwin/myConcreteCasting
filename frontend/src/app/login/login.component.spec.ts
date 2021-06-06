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

import { LoginComponent } from './login.component';
import { routes } from '../app-routing.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [LoginComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
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
    const emailInput = compiled.querySelector('input[id="email"]');
    const passwordInput = compiled.querySelector('input[id="password"]');
    const submitButton = compiled.querySelector('button');
    const link = compiled.querySelector('a');

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(link).toBeTruthy();
  });

  it('should test form validity', () => {
    const form = component.form;
    const emailInput = form.controls.email;
    const passwordInput = form.controls.password;

    expect(form.valid).toBeFalsy();

    emailInput.setValue('testMail@gmail.com');
    passwordInput.setValue('12345678');

    expect(form.valid).toBeTruthy();
  });

  it('should test input validity', () => {
    const emailInput = component.form.controls.email;
    const passwordInput = component.form.controls.password;

    expect(emailInput.valid).toBeFalsy();
    expect(passwordInput.valid).toBeFalsy();

    emailInput.setValue('testMail@gmail.com');
    passwordInput.setValue('12345678');
    expect(emailInput.valid).toBeTruthy();
    expect(passwordInput.valid).toBeTruthy();
  });

  it('should test input errors', () => {
    const emailInput = component.form.controls.email;
    const passwordInput = component.form.controls.password;

    expect(emailInput.errors).toBeTruthy();
    expect(passwordInput.errors).toBeTruthy();

    emailInput.setValue('testMail@gmail.com');
    expect(emailInput.errors).toBeNull();

    passwordInput.setValue('123456789');
    expect(passwordInput.errors).toBeNull();
  });

  it('should submit the form', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should create the request body', () => {
    const emailInput = component.form.controls.email;
    const passwordInput = component.form.controls.password;

    emailInput.setValue('testMail@gmail.com');
    passwordInput.setValue('12345678');

    const expectedJson = JSON.stringify({
      username: 'testMail@gmail.com',
      password: '12345678',
    });

    expect(component.makeRequestBody(component.form)).toEqual(expectedJson);
  });

  it('should test request response', fakeAsync(() => {
    const APIResponse = {
      expiry: '2021-06-06T20:39:23.135766Z',
      token: '25c8a07fc4c034229f15c888e3c8f0ea5c79b96a6d883a727460b82397629e06',
    };

    component.handleHttpResponse(APIResponse);

    tick();

    expect(localStorage.getItem('token')).not.toBeNull();
    expect(location.path()).toBe('/dashboard');
  }));

  it('should navigate to /register', () => {
    router.navigate(['register']).then(() => {
      expect(location.path()).toBe('/register');
    });
  });
});

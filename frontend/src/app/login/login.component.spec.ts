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

import { LoginComponent } from './login.component';
import { routes } from '../app-routing.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
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
      declarations: [LoginComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    localStorage.clear();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    location = TestBed.inject(Location);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    const emailInput = compiled.querySelector('input[id="email"]');
    const passwordInput = compiled.querySelector('input[id="password"]');
    const submitButton = compiled.querySelector('.signInBtn');
    const signUpButton = compiled.querySelector('.signUpBtn');

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();
  });

  it('should get form controls', () => {
    expect(component.f).toEqual(component.form.controls);
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

  it('should call onSubmit', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should test the submission of the form', () => {
    spyOn(component, 'handleHttpResponse');

    const form = component.form;
    const emailInput = form.controls.email;
    const passwordInput = form.controls.password;

    emailInput.setValue('testMail.com');
    passwordInput.setValue('1234');

    component.onSubmit();
    expect(component.handleHttpResponse).not.toHaveBeenCalled();
  });

  it('should test request response', fakeAsync(() => {
    let ErrorAPIResponse = {
      error: { message: 'Any message' },
      status: 400,
    };

    component.handleHttpResponse(ErrorAPIResponse);
    tick();
    expect(component.responseError).toBeTruthy();
    expect(component.responseErrorMessage).toEqual(
      ErrorAPIResponse.error.message
    );

    let SuccessAPIResponse = {
      status: 200,
      token: 'token',
      user: 'user@mail.com',
      user_id: 1,
    };
    component.handleHttpResponse(SuccessAPIResponse);
    tick();
    expect(location.path()).toBe('/dashboard');
    localStorage.clear();
  }));

  it('should navigate to /register', () => {
    router.navigate(['register']).then(() => {
      expect(location.path()).toBe('/register');
    });
  });

  /*it('should go to the user dashboard if he is already logged', () => {
    expect(component.isUserAlreadyLogged()).toBeFalsy();

    localStorage.setItem('token', 'testoken');
    localStorage.setItem('email', 'usermail');
    localStorage.setItem('userID', 'ID');

    expect(component.isUserAlreadyLogged()).toBeTruthy();
    localStorage.clear();
  });*/
});

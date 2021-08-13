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
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
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
    expect(component.f).toEqual(component.loginForm.controls);
  });

  it('should test form validity', () => {
    const form = component.loginForm;
    const emailInput = form.controls.email;
    const passwordInput = form.controls.password;

    expect(form.valid).toBeFalsy();

    emailInput.setValue('testMail@gmail.com');
    passwordInput.setValue('12345678');

    expect(form.valid).toBeTruthy();
  });

  it('should test input validity', () => {
    const emailInput = component.loginForm.controls.email;
    const passwordInput = component.loginForm.controls.password;

    expect(emailInput.valid).toBeFalsy();
    expect(passwordInput.valid).toBeFalsy();

    emailInput.setValue('testMail@gmail.com');
    passwordInput.setValue('12345678');
    expect(emailInput.valid).toBeTruthy();
    expect(passwordInput.valid).toBeTruthy();
  });

  it('should test input errors', () => {
    const emailInput = component.loginForm.controls.email;
    const passwordInput = component.loginForm.controls.password;

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
});

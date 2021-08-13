import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { MustMatch } from '../../../helpers/must-match.validator';

import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  submitted = false;

  responseErrorMessage!: string;
  responseError!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirm: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'passwordConfirm'), // Cross field validator
      } as AbstractControlOptions
    );
  }

  /**
   * Helper function for easier access to form fields controls
   */
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.accountService.registerUser(this.makeRequestBody(this.form)).subscribe(
      (response) => this.handleHttpResponse(response),
      (error) => this.handleHttpResponse(error)
    );
  }

  makeRequestBody(form: FormGroup) {
    return JSON.stringify({
      first_name: form.get('firstName')?.value,
      last_name: form.get('lastName')?.value,
      email: form.get('email')?.value,
      password: form.get('password')?.value,
    });
  }

  /**
   * Handle the treatement of the response returned by the API
   *
   * The Response should contain a field 'status' which should be set to:
   *  - 201 if user has been created
   *  - 400 if something went wrong
   *
   * @param response Response from the API
   */
  handleHttpResponse(response: any) {
    if (response.status === 400) {
      this.responseError = true;
      this.responseErrorMessage = response.error.email;
    } else if (response.status === 201) {
      this.router.navigate(['login']);
    }
  }
}

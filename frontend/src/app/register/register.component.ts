import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { MustMatch } from '../helpers/must-match.validator';

import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  submitted = false;

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
   * Helper function for easier access to form fields
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

  /**
   * Create the body for the registration request
   *
   * @param form
   * @returns the informations contained in the form in json format
   */
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
   * The Response should contain a field 'success' which may be true of false
   *
   * @param response Response from the API
   */
  handleHttpResponse(response: any) {
    if (response.hasOwnProperty('success') && response.success === true) {
      this.router.navigate(['login']);
    }
  }
}

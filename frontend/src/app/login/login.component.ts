import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
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

    this.accountService.signinUser(this.makeRequestBody(this.form)).subscribe(
      (response) => this.handleHttpResponse(response),
      (error) => this.handleHttpResponse(error)
    );
  }

  /**
   * Create the json body for the registration request
   *
   * @param form
   * @returns the informations contained in the form in json format
   */
  makeRequestBody(form: FormGroup) {
    return JSON.stringify({
      username: form.get('email')?.value,
      password: form.get('password')?.value,
    });
  }

  /**
   * Handle the treatement of the response returned by the API
   *
   * The Response contains a field 'success' which may be true of false
   *
   * @param response Response from the API
   */
  handleHttpResponse(response: any) {
    if (response.hasOwnProperty('token') && response.hasOwnProperty('expiry')) {
      this.accountService.storeToken(response.token);
      this.router.navigate(['/dashboard']);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  Form,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AccountService } from '../services/account.service';
import { LocalStorageService } from '../services/localstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  submitted = false;

  responseErrorMessage!: string;
  responseError!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    if (this.isUserAlreadyLogged()) {
      this.router.navigate(['/dashboard']);
    }

    this.initForm();
  }

  initForm() {
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

    this.accountService.loginUser(JSON.stringify(this.form.value)).subscribe(
      (response) => this.handleHttpResponse(response),
      (error) => this.handleHttpResponse(error)
    );
  }

  /**
   * Handle the treatement of the response returned by the API
   *
   * The Response contains a field 'success' which may be true of false
   *
   * @param response Response from the API
   */
  handleHttpResponse(response: any) {
    if (response.status === 400) {
      this.responseError = true;
      this.responseErrorMessage = response.error.message;
    }

    if (response.status === 200) {
      this.accountService.storeToken('Token ' + response.token);
      this.localStorageService.set('email', response.user);
      this.localStorageService.set('userID', response.user_id);
      this.router.navigate(['/dashboard']);
    }
  }

  isUserAlreadyLogged() {
    return (
      this.localStorageService.get('token') != null &&
      this.localStorageService.get('email') != null &&
      this.localStorageService.get('userID') != null
    );
  }
}

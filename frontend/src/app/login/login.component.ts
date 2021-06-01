import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
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

    this.accountService.signinUser(this.form.value).subscribe(
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
    if (response.success === true) {
      this.router.navigate(['/dashboard']);
    }
  }
}

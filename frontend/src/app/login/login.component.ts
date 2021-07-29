import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

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
    } else {
      this.initForm();
    }
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
    } else {
      this.accountService.loginUser(JSON.stringify(this.form.value)).subscribe(
        (response: any) => {
          this.accountService.storeToken(response.token);
          this.localStorageService.set(
            'user',
            JSON.stringify(
              new User(
                response.user.id,
                response.user.first_name,
                response.user.last_name,
                response.user.email
              )
            )
          );
          this.router.navigate(['/dashboard']);
        },
        (error: any) => {
          this.responseError = true;
          this.responseErrorMessage = error.error.message;
        }
      );
    }
  }

  isUserAlreadyLogged() {
    return (
      this.localStorageService.get('token') != null &&
      this.localStorageService.get('user') != null
    );
  }
}

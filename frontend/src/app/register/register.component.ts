import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        firstName: ['', Validators.required, Validators.pattern('^[a-zA-Z]+$')],
        lastName: ['', Validators.required, Validators.pattern('^[a-zA-Z]+$')],
        email: ['', Validators.required, Validators.email],
        password: ['', Validators.required, Validators.minLength(8)],
        passwordConfirm: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'passwordConfirm'), // Cross field validator
      } as AbstractControlOptions
    );
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    this.accountService.signupUser(this.form.value);
  }
}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    const user = {
      firstName: form.value['firstName'],
      lastName: form.value['lastName'],
      email: form.value['email'],
      password: form.value['password'],
    };
    this.accountService.signupUser(user);
  }
}

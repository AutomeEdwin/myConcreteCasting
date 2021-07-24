import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  Form,
} from '@angular/forms';
import { Router } from '@angular/router';

import { LocalStorageService } from '../services/localstorage.service';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss'],
})
export class AccountManagerComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onDeleteAccount() {
    this.accountService.deleteUserAccount().subscribe(
      (res) => {
        this.localStorageService.clear();
        this.router.navigate(['']);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onBack() {
    this.router.navigate(['/dashboard']);
  }
}

import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { LocalStorageService } from '../services/localstorage.service';
import { AccountService } from '../services/account.service';
import { ConfirmJobsiteDeleteComponent } from '../confirm-jobsite-delete/confirm-jobsite-delete.component';
import { User } from '../models/user.model';
import { MustMatch } from '../helpers/must-match.validator';

@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss'],
})
export class AccountManagerComponent implements OnInit {
  user = new User(
    JSON.parse(String(this.localStorageService.get('user'))).id,
    JSON.parse(String(this.localStorageService.get('user'))).firstName,
    JSON.parse(String(this.localStorageService.get('user'))).lastName,
    JSON.parse(String(this.localStorageService.get('user'))).email
  );

  editAccountForm!: FormGroup;
  changePasswordForm!: FormGroup;
  submitted: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    private accountService: AccountService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.editAccountForm = formBuilder.group({
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      email: this.user.getEmail(),
    });

    this.editAccountForm.get('firstName')?.setValue(this.user.getFirstName());
    this.editAccountForm.get('lastName')?.setValue(this.user.getLastName());

    this.changePasswordForm = formBuilder.group(
      {
        currentPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        newPasswordConfirm: new FormControl('', Validators.required),
      },
      {
        validator: MustMatch('newPassword', 'newPasswordConfirm'), // Cross field validator
      } as AbstractControlOptions
    );
  }

  ngOnInit(): void {}

  get accountForm() {
    return this.editAccountForm.controls;
  }

  get passwordForm() {
    return this.changePasswordForm.controls;
  }

  getUserFirstName() {
    return this.user.getFirstName();
  }

  getUserLastName() {
    return this.user.getLastName();
  }

  getUserEmail() {
    return this.user.getEmail();
  }

  onEditAccountSubmit() {
    this.submitted = true;

    if (this.editAccountForm.invalid) {
      return;
    }

    this.accountService.updateUserAccount(this.editAccountForm.value).subscribe(
      (res) => {
        console.log(res);
        this.submitted = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onEditPasswordSubmit() {
    this.submitted = true;

    if (this.editAccountForm.invalid) {
      return;
    }

    this.accountService
      .updateUserPassword(this.changePasswordForm.value)
      .subscribe(
        (res) => {
          console.log(res);
          this.submitted = false;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  onDeleteAccount() {
    const dialog = this.dialog.open(ConfirmJobsiteDeleteComponent);

    dialog.afterClosed().subscribe((result) => {
      if (result) {
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
    });
  }

  onBack() {
    this.router.navigate(['/dashboard']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { LocalStorageService } from '../services/localstorage.service';
import { AccountService } from '../services/account.service';
import { ConfirmJobsiteDeleteComponent } from '../confirm-jobsite-delete/confirm-jobsite-delete.component';
import { User } from '../models/user.model';

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

  constructor(
    private localStorageService: LocalStorageService,
    private accountService: AccountService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AccountService } from '../../../core/services/account.service';
import { LocalStorageService } from '../../../core/services/localstorage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    private accountService: AccountService,
    private localStorageService: LocalStorageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  goToAccountManager() {
    this.router.navigate(['account/']);
  }

  logout() {
    this.accountService.logoutUser().subscribe(
      (res) => {
        this.localStorageService.clear();
        this.router.navigate(['/login']);
      },
      (err) => {
        this.snackBar.open('Something went wrong !', 'ok', {
          duration: 5000,
        });
      }
    );
  }
}

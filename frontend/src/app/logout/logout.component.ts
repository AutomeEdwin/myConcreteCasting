import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AccountService } from '../services/account.service';
import { LocalStorageService } from '../services/localstorage.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private localStorageService: LocalStorageService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

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

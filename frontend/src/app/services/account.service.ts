import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './localstorage.service';

const headers = new HttpHeaders().set(
  'Content-Type',
  'application/json; charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  //readonly serverURL = 'https://api.concast.digitalconstruction.cloud/';
  readonly serverURL = 'http://localhost:8000/';

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  registerUser(user: any) {
    return this.httpClient.post(this.serverURL + 'register/', user, {
      headers,
    });
  }

  loginUser(user: any) {
    return this.httpClient.post(this.serverURL + 'login/', user, {
      headers,
    });
  }

  logoutUser() {
    this.httpClient
      .post(this.serverURL + 'logout/', null, {
        headers: new HttpHeaders({
          Authorization: 'Token ' + this.localStorageService.get('token'),
        }),
      })
      .subscribe(
        () => {},
        (error) => {
          console.log(error);
        }
      );
    this.localStorageService.remove('token');
  }

  storeToken(token: string) {
    this.localStorageService.set('token', token);
  }
}

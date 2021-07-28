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
  readonly serverURL = 'https://api.concast.digitalconstruction.cloud/';
  //readonly serverURL = 'http://localhost:8000/';

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
    return this.httpClient.get(this.serverURL + 'logout/', {
      headers: new HttpHeaders({
        Authorization: 'Token ' + this.localStorageService.get('token'),
      }),
    });
  }

  deleteUserAccount() {
    return this.httpClient.delete(
      this.serverURL +
        'deleteUser/' +
        JSON.parse(String(this.localStorageService.get('user'))).email,
      {
        headers: new HttpHeaders({
          Authorization: 'Token ' + this.localStorageService.get('token'),
        }),
      }
    );
  }

  updateUserAccount(modif: any) {
    return this.httpClient.patch(
      this.serverURL +
        'updateUser/' +
        JSON.parse(String(this.localStorageService.get('user'))).email,
      modif,
      {
        headers: new HttpHeaders({
          Authorization: 'Token ' + this.localStorageService.get('token'),
        }),
      }
    );
  }

  updateUserPassword(modif: any) {
    return this.httpClient.patch(
      this.serverURL +
        'updateUserPassword/' +
        JSON.parse(String(this.localStorageService.get('user'))).email,
      modif,
      {
        headers: new HttpHeaders({
          Authorization: 'Token ' + this.localStorageService.get('token'),
        }),
      }
    );
  }

  storeToken(token: string) {
    this.localStorageService.set('token', token);
  }
}

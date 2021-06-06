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
  readonly serverURL = 'http://127.0.0.1:8000/';
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  registerUser(user: any) {
    return this.httpClient.post(this.serverURL + 'api/register/', user, {
      headers,
    });
  }

  loginUser(user: any) {
    return this.httpClient.post(this.serverURL + 'api/login/', user, {
      headers,
    });
  }

  storeToken(token: string) {
    this.localStorageService.set('token', token);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const headers = new HttpHeaders().set(
  'Content-Type',
  'application/json; charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private httpClient: HttpClient) {}

  signupUser(user: any) {
    return this.httpClient.post('http://127.0.0.1:8000/api/signup', user, {
      headers,
    });
  }

  signinUser(user: any) {
    //console.log('test');
    return this.httpClient.post('http://127.0.0.1:8000/api/signin', user, {
      headers,
    });
  }
}

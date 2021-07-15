import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class JobsitesService {
  readonly serverURL = 'https://api.concast.digitalconstruction.cloud/';
  //readonly serverURL = 'http://localhost:8000/';

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  createJobsite(data: any) {
    return this.httpClient.post(this.serverURL + 'jobsites/', data, {
      headers: new HttpHeaders({
        Authorization: 'Token ' + this.localStorageService.get('token'),
      }),
    });
  }

  getJobsites() {
    return this.httpClient.get(
      this.serverURL + 'jobsites/' + localStorage.getItem('email'),
      {
        headers: new HttpHeaders({
          Authorization: 'Token ' + this.localStorageService.get('token'),
        }),
      }
    );
  }
}

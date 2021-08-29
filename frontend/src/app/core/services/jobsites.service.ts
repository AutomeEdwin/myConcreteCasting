import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './localstorage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobsitesService {
  serverURL = environment.apiURL;

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
      this.serverURL +
        'jobsites/' +
        JSON.parse(String(this.localStorageService.get('user'))).id,
      {
        headers: new HttpHeaders({
          Authorization: 'Token ' + this.localStorageService.get('token'),
        }),
      }
    );
  }

  getJobsiteByID(id: number) {
    return this.httpClient.get(
      this.serverURL +
        'jobsites/' +
        JSON.parse(String(this.localStorageService.get('user'))).id +
        '/' +
        id,
      {
        headers: new HttpHeaders({
          Authorization: 'Token ' + this.localStorageService.get('token'),
        }),
      }
    );
  }

  deleteJobsite(id: number) {
    return this.httpClient.delete(
      this.serverURL +
        'jobsites/' +
        JSON.parse(String(this.localStorageService.get('user'))).id +
        '/' +
        id,
      {
        headers: new HttpHeaders({
          Authorization: 'Token ' + this.localStorageService.get('token'),
        }),
      }
    );
  }

  getCastingTime(body: any) {
    return this.httpClient.post(this.serverURL + 'calculateCuringTime/', body, {
      headers: new HttpHeaders({
        Authorization: 'Token ' + this.localStorageService.get('token'),
      }),
    });
  }
}

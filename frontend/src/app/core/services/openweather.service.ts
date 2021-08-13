import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class OpenweatherService {
  //readonly serverURL = 'https://api.concast.digitalconstruction.cloud/';
  readonly serverURL = 'http://localhost:8000/';

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  getJobsiteWeather(coordinates: any) {
    return this.httpClient.post(
      this.serverURL + 'getJobsiteWeather/',
      coordinates,
      {
        headers: new HttpHeaders({
          Authorization: 'Token ' + this.localStorageService.get('token'),
        }),
      }
    );
  }
}

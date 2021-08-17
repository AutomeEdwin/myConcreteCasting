import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LocalStorageService } from './localstorage.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenweatherService {
  serverURL = environment.apiURL;

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

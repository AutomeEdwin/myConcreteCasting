import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class JobsitesService {
  readonly serverURL = 'https://api.concast.digitalconstruction.cloud/';
  //readonly serverURL = 'http://localhost:8000/';

  constructor(private httpClient: HttpClient) {}

  createJobsite(data: any) {
    return this.httpClient.post(this.serverURL + 'jobsites/', data);
  }

  getJobsites() {
    let header = new HttpHeaders().set('Accept', 'application/json');
    return this.httpClient.get(
      this.serverURL + 'jobsites/' + localStorage.getItem('email'),
      { headers: header }
    );
  }
}

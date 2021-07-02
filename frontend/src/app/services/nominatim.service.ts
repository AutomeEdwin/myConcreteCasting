import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NominatimService {
  readonly nominatimURL = 'https://nominatim.openstreetmap.org/search?';

  constructor(private httpClient: HttpClient) {}

  query(query: string) {
    return this.httpClient.get(this.nominatimURL);
  }
}

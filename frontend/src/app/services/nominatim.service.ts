import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NominatimService {
  readonly nominatimURL = 'https://nominatim.openstreetmap.org/';

  constructor(private httpClient: HttpClient) {}

  search(query: string) {
    query = query.replace(/ /g, '+');
    return this.httpClient.get(
      this.nominatimURL + 'search?q=' + query + '&format=json&limit=1'
    );
  }
}

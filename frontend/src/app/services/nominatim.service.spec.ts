import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { NominatimService } from './nominatim.service';

describe('NominatimService', () => {
  let nominatimService: NominatimService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NominatimService],
    });
    nominatimService = TestBed.inject(NominatimService);
  });

  let httpTestingController: HttpTestingController;
  beforeEach(
    () => (httpTestingController = TestBed.get(HttpTestingController))
  );

  beforeEach(() => (nominatimService = TestBed.get(NominatimService)));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(nominatimService).toBeTruthy();
  });
});

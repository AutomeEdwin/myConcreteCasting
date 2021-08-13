import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

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

  it('should be created', () => {
    expect(nominatimService).toBeTruthy();
  });
});

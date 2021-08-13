import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OpenweatherService } from './openweather.service';

describe('OpenweatherService', () => {
  let service: OpenweatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OpenweatherService],
    });
    service = TestBed.inject(OpenweatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

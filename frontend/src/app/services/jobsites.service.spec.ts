import { TestBed } from '@angular/core/testing';

import { JobsitesService } from './jobsites.service';

describe('JobsitesService', () => {
  let service: JobsitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobsitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

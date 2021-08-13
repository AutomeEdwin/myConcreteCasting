import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { JobsitesService } from './jobsites.service';

describe('JobsitesService', () => {
  let jobsiteService: JobsitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JobsitesService],
    });
    jobsiteService = TestBed.inject(JobsitesService);
    localStorage.setItem(
      'user',
      '{"id":1,"firstName":"test","lastName":"test","email":"test@test.com"}'
    );
  });

  it('should be created', () => {
    expect(jobsiteService).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { JobsitesService } from './jobsites.service';

describe('JobsitesService', () => {
  let jobsiteService: JobsitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JobsitesService],
    });
    jobsiteService = TestBed.inject(JobsitesService);
  });

  let httpTestingController: HttpTestingController;
  beforeEach(
    () => (httpTestingController = TestBed.get(HttpTestingController))
  );

  beforeEach(() => (jobsiteService = TestBed.get(JobsitesService)));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(jobsiteService).toBeTruthy();
  });
});

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { JobsitesService } from '../services/jobsites.service';

import { Jobsite } from '../models/jobsite.model';

@Component({
  selector: 'app-jobsite-viewer',
  templateUrl: './jobsite-viewer.component.html',
  styleUrls: ['./jobsite-viewer.component.scss'],
})
export class JobsiteViewerComponent implements OnInit {
  jobsite!: Jobsite;

  constructor(
    private router: Router,
    private jobsiteService: JobsitesService
  ) {}

  ngOnInit(): void {
    this.jobsiteService
      .getJobsiteByID(+this.router.url.replace('/jobsite/', ''))
      .subscribe(
        (res: any) => {
          this.jobsite = new Jobsite(
            res.id,
            res.jobsite_owner,
            res.jobsite_name,
            res.jobsite_address,
            res.jobsite_coordinates,
            res.jobsite_description,
            res.jobsite_castings
          );
        },
        (err) => {}
      );
  }

  getJobsiteName() {
    return this.jobsite.getName();
  }

  getJobsiteDescription() {
    return this.jobsite.getDescription();
  }

  getJobsiteAddress() {
    return this.jobsite.getAddress();
  }

  getJobsiteCoordinates() {
    return this.jobsite.getCoordinates();
  }

  getJobsiteCastings() {
    return this.jobsite.getCastings();
  }

  onBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

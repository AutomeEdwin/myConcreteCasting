import { Component, OnInit } from '@angular/core';
import { Jobsite } from '../models/jobsite.model';

import { JobsitesService } from '../services/jobsites.service';

@Component({
  selector: 'app-jobsite-viewer',
  templateUrl: './jobsite-viewer.component.html',
  styleUrls: ['./jobsite-viewer.component.scss'],
})
export class JobsiteViewerComponent implements OnInit {
  data: any;
  jobsiteArray: Array<Jobsite> = [];

  constructor(private jobsitesService: JobsitesService) {}

  ngOnInit(): void {
    this.getJobsites();
  }

  getJobsites() {
    this.jobsiteArray.length = 0;
    this.jobsitesService.getJobsites().subscribe(
      (response) => {
        this.data = response;

        for (let i in this.data) {
          this.jobsiteArray.push(
            new Jobsite(
              this.data[i].id,
              this.data[i].jobsite_owner,
              this.data[i].jobsite_name,
              this.data[i].jobsite_address,
              this.data[i].jobsite_coordinates,
              this.data[i].jobsite_description,
              this.data[i].jobsite_castings
            )
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getJobsiteName(i: number) {
    return this.jobsiteArray[i].getName();
  }

  getJobsiteDescription(i: number) {
    return this.jobsiteArray[i].getDescription();
  }

  getJobsiteAddress(i: number) {
    return this.jobsiteArray[i].getAddress();
  }

  getCastings(i: number) {
    return this.jobsiteArray[i].getCastings();
  }
}

import { Component, OnInit } from '@angular/core';

import { JobsitesService } from '../services/jobsites.service';

@Component({
  selector: 'app-jobsite-viewer',
  templateUrl: './jobsite-viewer.component.html',
  styleUrls: ['./jobsite-viewer.component.scss'],
})
export class JobsiteViewerComponent implements OnInit {
  constructor(private jobsitesService: JobsitesService) {}

  ngOnInit(): void {
    this.getJobsites();
  }

  getJobsites() {
    this.jobsitesService.getJobsites().subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

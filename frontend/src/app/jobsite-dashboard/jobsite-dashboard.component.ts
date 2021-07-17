import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewJobsiteComponent } from '../new-jobsite/new-jobsite.component';
import { Jobsite } from '../models/jobsite.model';
import { JobsitesService } from '../services/jobsites.service';

@Component({
  selector: 'app-jobsite-dashboard',
  templateUrl: './jobsite-dashboard.component.html',
  styleUrls: ['./jobsite-dashboard.component.scss'],
})
export class JobsiteDashboardComponent implements OnInit {
  data: any;
  jobsiteArray: Array<Jobsite> = [];

  constructor(
    public dialog: MatDialog,
    private jobsitesService: JobsitesService
  ) {}

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

  getJobsite(i: number) {
    return this.jobsiteArray[i];
  }

  openForm() {
    const dialog = this.dialog.open(NewJobsiteComponent, {
      height: '98%',
      width: '100%',
    });

    dialog.afterClosed().subscribe((result) => {
      this.getJobsites();
    });
  }
}

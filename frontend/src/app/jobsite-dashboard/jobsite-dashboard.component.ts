import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewJobsiteComponent } from '../new-jobsite/new-jobsite.component';
import { Jobsite } from '../models/jobsite.model';
import { JobsitesService } from '../services/jobsites.service';
import { Casting } from '../models/casting.model';

@Component({
  selector: 'app-jobsite-dashboard',
  templateUrl: './jobsite-dashboard.component.html',
  styleUrls: ['./jobsite-dashboard.component.scss'],
})
export class JobsiteDashboardComponent implements OnInit {
  //  data: any;
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
        this.fillJobsitesArray(response);
      },
      (error) => {}
    );
  }

  fillJobsitesArray(data: any) {
    for (let i in data) {
      let castingsArray: Array<Casting> = [];
      let castings = JSON.parse(data[i].jobsite_castings);

      for (let j in castings) {
        let casting = new Casting(
          castings[j].casting_name,
          castings[j].casting_description,
          castings[j].casting_fcm2_fcm28_ratio,
          castings[j].casting_type2_addition,
          castings[j].casting_rc2_rc28_ratio,
          castings[j].casting_cement_type
        );

        castingsArray.push(casting);
      }
      this.jobsiteArray.push(
        new Jobsite(
          data[i].id,
          data[i].jobsite_owner,
          data[i].jobsite_name,
          data[i].jobsite_address,
          JSON.parse(data[i].jobsite_coordinates),
          data[i].jobsite_description,
          castingsArray
        )
      );
    }
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

import { Component, OnInit } from '@angular/core';
import { Jobsite } from '../../models/jobsite.model';
import { JobsitesService } from '../../services/jobsites.service';
import { Casting } from '../../models/casting.model';

@Component({
  selector: 'app-jobsite-dashboard',
  templateUrl: './jobsite-dashboard.component.html',
  styleUrls: ['./jobsite-dashboard.component.scss'],
})
export class JobsiteDashboardComponent implements OnInit {
  //  data: any;
  jobsiteArray: Array<Jobsite> = [];

  constructor(private jobsitesService: JobsitesService) {}

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
      let castings = JSON.parse(data[i].castings);

      for (let j in castings) {
        let casting = new Casting(
          castings[j].id,
          castings[j].name,
          castings[j].description,
          castings[j].isClassEI,
          castings[j].fcm2_fcm28_ratio,
          castings[j].type2_addition,
          castings[j].rc2_rc28_ratio,
          castings[j].cement_type,
          castings[j].curing_start,
          castings[j].curing_end
        );

        castingsArray.push(casting);
      }
      this.jobsiteArray.push(
        new Jobsite(
          data[i].id,
          data[i].owner,
          data[i].name,
          data[i].address,
          JSON.parse(data[i].coordinates),
          data[i].description,
          castingsArray
        )
      );
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { JobsitesService } from '../services/jobsites.service';
import { Jobsite } from '../models/jobsite.model';
import { Casting } from '../models/casting.model';
import { ConfirmJobsiteDeleteComponent } from '../confirm-jobsite-delete/confirm-jobsite-delete.component';

@Component({
  selector: 'app-jobsite-viewer',
  templateUrl: './jobsite-viewer.component.html',
  styleUrls: ['./jobsite-viewer.component.scss'],
})
export class JobsiteViewerComponent implements OnInit {
  jobsite!: Jobsite;

  constructor(
    private router: Router,
    private jobsiteService: JobsitesService,
    public dialog: MatDialog
  ) {
    this.jobsiteService
      .getJobsiteByID(+this.router.url.replace('/jobsite/', ''))
      .subscribe(
        (res: any) => {
          this.createJobsite(res);
        },
        (err) => {}
      );
  }

  createJobsite(res: any) {
    let castingsArray: Array<Casting> = [];
    let castings = JSON.parse(res.jobsite_castings);

    for (let j in castings) {
      let casting = new Casting(
        castings[j].casting_name,
        castings[j].casting_description,
        castings[j].casting_infos
      );

      castingsArray.push(casting);
    }

    this.jobsite = new Jobsite(
      res.id,
      res.jobsite_owner,
      res.jobsite_name,
      res.jobsite_address,
      JSON.parse(res.jobsite_coordinates),
      res.jobsite_description,
      castingsArray
    );
  }

  ngOnInit(): void {}

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

  getCastingName(i: number) {
    return this.getJobsiteCastings()[i].getName();
  }

  getCastingDescription(i: number) {
    return this.getJobsiteCastings()[i].getDescription();
  }
  getCastingInfos(i: number) {
    return this.getJobsiteCastings()[i].getInfos();
  }

  onDelete() {
    const dialog = this.dialog.open(ConfirmJobsiteDeleteComponent);

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.jobsiteService.deleteJobsite(this.jobsite.getId()).subscribe(
          (res) => {
            this.router.navigate(['/dashboard']);
          },
          (err) => {}
        );
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

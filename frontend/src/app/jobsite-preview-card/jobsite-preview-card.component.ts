import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Jobsite } from '../models/jobsite.model';

@Component({
  selector: 'app-jobsite-preview-card',
  templateUrl: './jobsite-preview-card.component.html',
  styleUrls: ['./jobsite-preview-card.component.scss'],
})
export class JobsitePreviewCardComponent implements OnInit {
  @Input() jobsite!: Jobsite;

  constructor(private router: Router) {}

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

  onDelete() {}

  onDetail() {
    this.router.navigate(['jobsite/', this.jobsite.getId()]);
  }
}

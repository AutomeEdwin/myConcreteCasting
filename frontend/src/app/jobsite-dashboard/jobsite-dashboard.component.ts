import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewJobsiteComponent } from '../new-jobsite/new-jobsite.component';

@Component({
  selector: 'app-jobsite-dashboard',
  templateUrl: './jobsite-dashboard.component.html',
  styleUrls: ['./jobsite-dashboard.component.scss'],
})
export class JobsiteDashboardComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openForm() {
    const dialog = this.dialog.open(NewJobsiteComponent, {
      height: '100%',
      minHeight: 'calc(100vh - 90px)',
      width: '100%',
    });
  }
}

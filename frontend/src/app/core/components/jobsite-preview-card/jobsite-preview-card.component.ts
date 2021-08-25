import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { Jobsite } from '../../models/jobsite.model';
import { JobsitesService } from '../../services/jobsites.service';
import { OpenweatherService } from '../../services/openweather.service';
import { ConfirmJobsiteDeleteComponent } from '../confirm-jobsite-delete/confirm-jobsite-delete.component';
import { Weather } from '../../models/weather.model';

@Component({
  selector: 'app-jobsite-preview-card',
  templateUrl: './jobsite-preview-card.component.html',
  styleUrls: ['./jobsite-preview-card.component.scss'],
})
export class JobsitePreviewCardComponent implements OnInit {
  @Input() jobsite!: Jobsite;
  weather!: Weather;

  constructor(
    private router: Router,
    private jobsiteService: JobsitesService,
    private openweatherService: OpenweatherService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getWeather();
  }

  getWeather() {
    let coordinates = {
      lat: this.jobsite.getCoordinates()[0],
      lon: this.jobsite.getCoordinates()[1],
    };

    this.openweatherService.getJobsiteWeather(coordinates).subscribe(
      (res: any) => {
        this.weather = new Weather(
          res.description,
          res.icon,
          res.temperature,
          res.humidity,
          res.cloudsPercentage,
          res.windSpeed
        );
      },
      (err) => {}
    );
  }

  getJobsiteDescription() {
    return this.jobsite.getDescription() === ''
      ? 'There is no description for this jobsite'
      : this.jobsite.getDescription();
  }

  getWeatherIcon() {
    return 'http://openweathermap.org/img/w/' + this.weather.getIcon() + '.png';
  }

  onDelete() {
    const dialog = this.dialog.open(ConfirmJobsiteDeleteComponent);

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.jobsiteService.deleteJobsite(this.jobsite.getId()).subscribe(
          (res) => {
            // TODO refresh dahsboard
          },
          (err) => {}
        );
      }
    });
  }

  onDetail() {
    this.router.navigate(['jobsite/', this.jobsite.getId()]);
  }
}

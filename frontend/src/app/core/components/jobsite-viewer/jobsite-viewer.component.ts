import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { JobsitesService } from '../../services/jobsites.service';
import { OpenweatherService } from '../../services/openweather.service';
import { Jobsite } from '../../models/jobsite.model';
import { Casting } from '../../models/casting.model';
import { Weather } from '../../models/weather.model';
import { ConfirmJobsiteDeleteComponent } from '../confirm-jobsite-delete/confirm-jobsite-delete.component';

@Component({
  selector: 'app-jobsite-viewer',
  templateUrl: './jobsite-viewer.component.html',
  styleUrls: ['./jobsite-viewer.component.scss'],
})
export class JobsiteViewerComponent implements OnInit {
  jobsite!: Jobsite;
  weather!: Weather;

  constructor(
    private router: Router,
    private jobsiteService: JobsitesService,
    private openweatherService: OpenweatherService,
    public dialog: MatDialog
  ) {
    this.jobsiteService
      .getJobsiteByID(+this.router.url.replace('/jobsite/', ''))
      .subscribe(
        (res: any) => {
          this.createJobsite(res);
          this.getWeather();
        },
        (err) => {}
      );
  }

  createJobsite(res: any) {
    let castingsArray: Array<Casting> = [];
    let castings = JSON.parse(res.castings);

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
        castings[j].strength_class,
        Number(castings[j].curing_start),
        Number(castings[j].curing_duration)
      );
      castingsArray.push(casting);
    }

    this.jobsite = new Jobsite(
      res.id,
      res.owner,
      res.name,
      res.address,
      JSON.parse(res.coordinates),
      res.description,
      castingsArray
    );
  }

  ngOnInit(): void {}

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

  onDeleteJobsite() {
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

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { JobsitesService } from '../services/jobsites.service';
import { OpenweatherService } from '../services/openweather.service';
import { Jobsite } from '../models/jobsite.model';
import { Casting } from '../models/casting.model';
import { Weather } from '../models/weather.model';
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
    let castings = JSON.parse(res.jobsite_castings);

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
      (err) => {
        console.log(err);
      }
    );
  }

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

  getCastingConcreteRatio(i: number) {
    return this.getJobsiteCastings()[i].getfcm2_fcm28_ratio().toString() ===
      'None'
      ? 'N/A'
      : this.getJobsiteCastings()[i].getfcm2_fcm28_ratio().toString();
  }

  getCastingCementRatio(i: number) {
    return this.getJobsiteCastings()[i].getrc2_rc28_ratio().toString() ===
      'None'
      ? 'N/A'
      : this.getJobsiteCastings()[i].getrc2_rc28_ratio().toString();
  }

  getCastingAdditions(i: number) {
    return this.getJobsiteCastings()[i].getType2Addition();
  }

  getCastingCementType(i: number) {
    return this.getJobsiteCastings()[i].getCementType();
  }

  getWeatherDescription() {
    return this.weather.getDescription();
  }

  getWeatherIcon() {
    return 'http://openweathermap.org/img/w/' + this.weather.getIcon() + '.png';
  }

  getWeatherTemperature() {
    return this.weather.getTemperature();
  }

  getWeatherHumidity() {
    return this.weather.getHumidity();
  }

  getWeatherClouds() {
    return this.weather.getCloudsPercentage();
  }

  getWeatherWindSpeed() {
    return this.weather.getWindSpeed();
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

  onStartCuring(i: number) {
    let x = {
      is_indoor: false,
      fcm2_fcm28_ratio:
        this.getCastingConcreteRatio(i).toString() === 'N/A'
          ? null
          : this.getCastingConcreteRatio(i),
      type2_addition: Boolean(this.getCastingAdditions(i)),
      rc2_rc28_ratio:
        this.getCastingCementRatio(i) === 'N/A'
          ? null
          : this.getCastingCementRatio(i),
      cement_type: this.getCastingCementType(i),
      temp: this.getWeatherTemperature(),
      humidity: this.getWeatherHumidity(),
      wind: this.getWeatherWindSpeed(),
      clouds: this.getWeatherClouds(),
    };

    console.log(x);

    this.jobsiteService.getCastingCuringTime(x).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

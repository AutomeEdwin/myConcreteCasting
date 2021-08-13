import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';

import { JobsitesService } from '../../services/jobsites.service';
import { Casting } from '../../models/casting.model';

@Component({
  selector: 'app-casting-viewer',
  templateUrl: './casting-viewer.component.html',
  styleUrls: ['./casting-viewer.component.scss'],
})
export class CastingViewerComponent implements OnInit, OnDestroy {
  @Input() casting!: Casting;
  @Input() index!: number;
  @Input() coordinates!: number[];
  @Input() jobsiteID!: number;

  subscription!: Subscription;

  seconds!: number;
  minutes!: number;
  hours!: number;
  days!: number;

  constructor(private jobsiteService: JobsitesService) {}

  ngOnInit(): void {
    if (this.isCuringInProgress()) {
      this.subscription = interval(1000).subscribe((x) => {
        this.setTimeUnits();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getCastingName() {
    return this.casting.getName();
  }

  getCastingDescription() {
    return this.casting.getDescription() === ''
      ? 'There is no description for this casting'
      : this.casting.getDescription();
  }

  getCastingClassEI() {
    return this.casting.getIsClassEI().toString() === 'True' ? 'Yes' : 'No';
  }

  getCastingConcreteRatio() {
    return this.casting.getfcm2_fcm28_ratio().toString() === 'None'
      ? 'N/A'
      : this.casting.getfcm2_fcm28_ratio().toString();
  }

  getCastingCementRatio() {
    return this.casting.getrc2_rc28_ratio().toString() === 'None'
      ? 'N/A'
      : this.casting.getrc2_rc28_ratio().toString();
  }

  getCastingAdditions() {
    return this.casting.getType2Addition().toString() === 'True' ? 'Yes' : 'No';
  }

  isCuringInProgress() {
    return new Date() < new Date(this.casting.getCuringEndDate());
  }

  isCuringFinished() {
    return new Date(this.casting.getCuringEndDate()) < new Date();
  }

  onStartCuring() {
    let x = {
      jobsite_id: this.jobsiteID,
      casting_index: this.index,
    };

    this.jobsiteService.getCastingCuringTime(x).subscribe(
      (res: any) => {
        this.casting.setCuringStartDate(new Date(res.startCuringDate));
        this.casting.setCuringEndDate(new Date(res.endCuringDate));

        this.subscription = interval(1000).subscribe((x) => {
          this.setTimeUnits();
        });
      },
      (err) => {}
    );
  }

  setTimeUnits() {
    let timeDiff =
      new Date(this.casting.getCuringEndDate()).getTime() -
      new Date().getTime();
    this.seconds = Math.floor((timeDiff / 1000) % 60);
    this.minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    this.hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    this.days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }
}

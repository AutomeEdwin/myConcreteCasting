import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';

import { JobsitesService } from '../../services/jobsites.service';
import { Casting } from '../../models/casting.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  datePicker = new FormGroup({
    startingDate: new FormControl('', [Validators.required]),
    targetStrength: new FormControl('', [Validators.required]),
  });

  subscription!: Subscription;

  curinghours!: number;
  curingdays!: number;
  hardeninghours!: number;
  hardeningdays!: number;

  constructor(private jobsiteService: JobsitesService) {}

  ngOnInit(): void {
    if (this.casting.isCuringInProgress()) {
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

  onStartCuring() {
    if (this.datePicker.invalid) {
      return;
    }

    let date = this.datePicker.get('startingDate')?.value;
    let x = {
      jobsite_id: this.jobsiteID,
      casting_index: this.index,
      startingDate: date.getTime() / 1000,
      targetStrength: this.datePicker.get('targetStrength')?.value,
    };

    this.jobsiteService.getCastingCuringTime(x).subscribe(
      (res: any) => {
        this.casting.setCuringStartDate(res.startCuringDate);
        this.casting.setCuringDuration(res.curingDuration);
        this.casting.setHardeningDuration(res.hardening_duration);

        this.subscription = interval(1000).subscribe((x) => {
          this.setTimeUnits();
        });
      },
      (err) => {}
    );
  }

  setTimeUnits() {
    let curingRemainingTime = this.casting.getCuringRemainingTime();
    let hardeningRemainingTime = this.casting.getHardeningRemainingTime();

    this.curinghours = Math.floor((curingRemainingTime / (60 * 60)) % 24);
    this.curingdays = Math.floor(curingRemainingTime / (60 * 60 * 24));

    this.hardeninghours = Math.floor((hardeningRemainingTime / (60 * 60)) % 24);
    this.hardeningdays = Math.floor(hardeningRemainingTime / (60 * 60 * 24));
  }
}

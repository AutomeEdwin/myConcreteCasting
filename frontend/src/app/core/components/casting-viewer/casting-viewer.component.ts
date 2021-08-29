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

  subscription!: Subscription;

  minCastingDate = new Date();
  maxCastingDate = new Date();
  targetStrength!: number;
  castingStartDate!: Date;

  datePicker!: FormGroup;

  curinghours!: number;
  curingdays!: number;
  hardeninghours!: number;
  hardeningdays!: number;

  constructor(private jobsiteService: JobsitesService) {
    this.minCastingDate.setDate(this.minCastingDate.getDate() - 5);
  }

  ngOnInit(): void {
    this.targetStrength =
      this.casting.getTargetStrength().toString() === 'NaN'
        ? 1
        : this.casting.getTargetStrength();
    this.castingStartDate = new Date(this.casting.getCuringStartDate() * 1000);

    this.datePicker = new FormGroup({
      startingDate: new FormControl(new Date()),
      targetStrength: new FormControl(this.casting.getTargetStrength()),
    });

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

  onRefreshTime() {
    if (this.datePicker.invalid) {
      return;
    }

    let date = this.datePicker.get('startingDate')?.value;
    let x = {
      jobsite_id: this.jobsiteID,
      casting_index: this.index,
      startingDate: Math.floor(date.getTime() / 1000),
      targetStrength: this.datePicker.get('targetStrength')?.value,
    };

    this.jobsiteService.getCastingTime(x).subscribe(
      (res: any) => {
        console.log(res);
        this.casting.setTargetStrength(res.targetStrength);
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
    let hardeningEndingDate = this.casting.getHardeningRemainingTime();

    this.curinghours = Math.floor(
      (curingRemainingTime / (1000 * 60 * 60)) % 24
    );
    this.curingdays = Math.floor(curingRemainingTime / (1000 * 60 * 60 * 24));

    this.hardeninghours = Math.floor(
      (hardeningEndingDate / (1000 * 60 * 60)) % 24
    );
    this.hardeningdays = Math.floor(
      hardeningEndingDate / (1000 * 60 * 60 * 24)
    );
  }
}

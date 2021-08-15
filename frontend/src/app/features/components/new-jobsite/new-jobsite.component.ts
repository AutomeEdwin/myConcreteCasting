import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import {
  StepperOrientation,
  STEPPER_GLOBAL_OPTIONS,
} from '@angular/cdk/stepper';

import Map from 'ol/Map';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import * as olProj from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { MapBrowserEvent } from 'ol';
import { Fill, Stroke, Circle, Style } from 'ol/style';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';

import { map, timeout } from 'rxjs/operators';

import { JobsitesService } from '../../../core/services/jobsites.service';
import { NominatimService } from '../../../core/services/nominatim.service';
import { LocalStorageService } from '../../../core/services/localstorage.service';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

interface Cement {
  value: string;
}

@Component({
  selector: 'app-new-jobsite',
  templateUrl: './new-jobsite.component.html',
  styleUrls: ['./new-jobsite.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class NewJobsiteComponent implements OnInit {
  // Hardcoded data that point the Grand Place of Brussels
  latitude = 4.352530764849208;
  longitude = 50.846642213471654;

  newJobsiteForm!: FormGroup;
  concreteCastings!: FormArray;
  map!: Map;
  marker = new Feature<Geometry>({
    geometry: new Point(olProj.fromLonLat([this.latitude, this.longitude])),
  });

  stepperOrientation: Observable<StepperOrientation>;
  advancedConcreteParameters: Array<boolean> = [false];

  cementTypes: Cement[] = [
    { value: 'oversulfated cement' },

    { value: 'CEM 1 52.5 N ou R' },
    { value: 'CEM 1 42.5 N ou R' },

    { value: 'CEM 2/A-M ou -V 42.5 N ou R ou 32.5 R' },

    { value: 'CEM 2/A-S, -D ou -LL 52.5 N ou R' },
    { value: 'CEM 2/A-S, -D ou -LL 42.5 N ou R' },
    { value: 'CEM 2/A-S, -D ou -LL 32.5 R' },
    { value: 'CEM 2/A-S, -D, -LL, -M ou -V 32.5 N' },

    { value: 'CEM 2/B-S, -LL, -M ou -V 42.5 N ou R ou 32.5 R' },
    { value: 'CEM 2/B-S, -LL, -M ou -V 32.5 N' },

    { value: 'CEM 3/A 52.5 N ou 42.5 N' },
    { value: 'CEM 3/A 32.5 N' },
    { value: 'CEM 3/B 42.5 N ou 32.5 N' },
    { value: 'CEM 3/C 32.5 N' },

    { value: 'CEM 5/A 32.5 N' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private jobsitesService: JobsitesService,
    private nominatomService: NominatimService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialogRef<NewJobsiteComponent>
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initForm(): void {
    this.newJobsiteForm = this.formBuilder.group({
      owner: JSON.parse(String(this.localStorageService.get('user'))).id,
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      coordinates: new FormControl(
        {
          lattitude: Number,
          longitude: Number,
        },
        [Validators.required]
      ),
      castings: this.formBuilder.array([this.createConcreteCasting()]),
    });

    this.newJobsiteForm
      .get('coordinates')
      ?.setValue([this.latitude, this.longitude]);
  }

  get f() {
    return this.newJobsiteForm.controls;
  }

  getJobsite(field: string): string {
    return this.newJobsiteForm.get(field)?.value;
  }

  get getCastingsControls() {
    return <FormArray>this.newJobsiteForm.get('castings');
  }

  getCasting(i: number, prop: string): string {
    this.concreteCastings = this.newJobsiteForm.get('castings') as FormArray;
    return this.concreteCastings.at(i).get(prop)?.value;
  }

  createConcreteCasting(): FormGroup {
    return this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      isClassEI: new FormControl(false),
      fcm2_fcm28_ratio: new FormControl(null),
      type2_addition: new FormControl(false),
      rc2_rc28_ratio: new FormControl(null),
      cement_type: new FormControl('', [Validators.required]),
    });
  }

  addConcreteCasting(): void {
    this.concreteCastings = this.newJobsiteForm.get('castings') as FormArray;
    this.concreteCastings.push(this.createConcreteCasting());
    this.advancedConcreteParameters.push(false);
  }

  removeConcreteCasting(i: number): void {
    this.concreteCastings = this.newJobsiteForm.get('castings') as FormArray;
    this.concreteCastings.removeAt(i);
    this.advancedConcreteParameters.splice(i, i + 1);
  }

  isLastArea(): boolean {
    this.concreteCastings = this.newJobsiteForm.get('castings') as FormArray;
    return this.concreteCastings.length === 1;
  }

  advancedConcreteParametersToggle(event: MatSlideToggleChange, i: number) {
    this.advancedConcreteParameters[i] = event.checked;
  }

  onSubmit() {
    if (this.newJobsiteForm.invalid) {
      return;
    }

    this.jobsitesService.createJobsite(this.newJobsiteForm.value).subscribe(
      (res) => {
        this.dialog.close();
      },
      (err) => {}
    );
  }

  // MAP LOGIC
  initMap() {
    this.marker.setStyle(
      new Style({
        image: new Circle({
          fill: new Fill({
            color: 'rgba(255, 0, 0,0.8)',
          }),
          stroke: new Stroke({
            color: 'rgba(255, 0, 0,0.8)',
            width: 10,
          }),
          radius: 10,
        }),
        fill: new Fill({
          color: 'rgba(255, 0, 0,0.8)',
        }),
        stroke: new Stroke({
          color: 'rgba(255, 0, 0,0.8)',
          width: 1,
        }),
      })
    );

    this.map = new Map({
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({
          source: new VectorSource({
            features: [this.marker],
          }),
        }),
      ],
      view: new View({
        center: olProj.fromLonLat([this.latitude, this.longitude]),
        zoom: 9,
      }),
      target: 'new-jobsite-map',
    });

    this.map.on('singleclick', (event) => {
      let x = this.getClickCoordinates(event);

      this.newJobsiteForm.get('coordinates')?.setValue(x);
      this.updateMarker(x[0], x[1]);
      this.latitude = x[0];
      this.longitude = x[1];
    });
  }

  updateMarker(lon: number, lat: number) {
    this.marker.setGeometry(new Point(olProj.fromLonLat([lon, lat])));
  }

  getClickCoordinates(event: MapBrowserEvent<any>) {
    return olProj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
  }

  getCoordinateFromAddress() {
    this.nominatomService
      .search(this.newJobsiteForm.get('address')?.value)
      .pipe(timeout(1000))
      .subscribe(
        (res) => {
          let data = JSON.stringify(res);
          data = data.substring(1, data.length - 1);
          let parsedData = JSON.parse(data);
          let json = {
            display_name: parsedData.display_name,
            lon: Number(parsedData.lat),
            lat: Number(parsedData.lon),
          };

          this.newJobsiteForm.get('address')?.setValue(json.display_name);
          this.newJobsiteForm
            .get('coordinates')
            ?.setValue([+json.lat, +json.lon]);
          this.latitude = json.lat;
          this.longitude = json.lon;

          this.updateMarker(json.lat, json.lon);
        },
        (err) => {}
      );
  }
}

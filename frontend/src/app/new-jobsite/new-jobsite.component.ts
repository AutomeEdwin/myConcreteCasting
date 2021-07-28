import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

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

import { timeout } from 'rxjs/operators';

import { JobsitesService } from '../services/jobsites.service';
import { NominatimService } from '../services/nominatim.service';
import { LocalStorageService } from '../services/localstorage.service';

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
  lattitude = 4.352530764849208;
  longitude = 50.846642213471654;

  form!: FormGroup;
  concreteCastings!: FormArray;
  map!: Map;
  marker = new Feature<Geometry>({
    geometry: new Point(olProj.fromLonLat([this.lattitude, this.longitude])),
  });

  constructor(
    private formBuilder: FormBuilder,
    private jobsitesService: JobsitesService,
    private nominatomService: NominatimService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialogRef<NewJobsiteComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      jobsite_owner: JSON.parse(String(this.localStorageService.get('user')))
        .email,
      jobsite_name: new FormControl('', [Validators.required]),
      jobsite_address: new FormControl('', [Validators.required]),
      jobsite_description: new FormControl(''),
      jobsite_coordinates: new FormControl(
        {
          lattitude: Number,
          longitude: Number,
        },
        [Validators.required]
      ),
      jobsite_castings: this.formBuilder.array([this.createConcreteCasting()]),
    });

    this.form
      .get('jobsite_coordinates')
      ?.setValue([this.lattitude, this.longitude]);
  }

  get f() {
    return this.form.controls;
  }

  getJobsite(field: string): string {
    return this.form.get(field)?.value;
  }

  get getCastingsControls() {
    return <FormArray>this.form.get('jobsite_castings');
  }

  getCasting(i: number, prop: string): string {
    this.concreteCastings = this.form.get('jobsite_castings') as FormArray;
    return this.concreteCastings.at(i).get(prop)?.value;
  }

  createConcreteCasting(): FormGroup {
    return this.formBuilder.group({
      casting_name: new FormControl('', [Validators.required]),
      casting_description: new FormControl(''),
      casting_infos: new FormControl('', [Validators.required]),
    });
  }

  addConcreteCasting(): void {
    this.concreteCastings = this.form.get('jobsite_castings') as FormArray;
    this.concreteCastings.push(this.createConcreteCasting());
  }

  removeConcreteCasting(i: number): void {
    this.concreteCastings = this.form.get('jobsite_castings') as FormArray;
    this.concreteCastings.removeAt(i);
  }

  isLastArea(): boolean {
    this.concreteCastings = this.form.get('jobsite_castings') as FormArray;
    return this.concreteCastings.length === 1;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.jobsitesService.createJobsite(this.form.value).subscribe(
      (res) => {
        this.dialog.close();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // MAP
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
        center: olProj.fromLonLat([this.lattitude, this.longitude]),
        zoom: 9,
      }),
      target: 'new-jobsite-map',
    });

    this.map.on('singleclick', (event) => {
      // get new coordinates
      this.getClickCoordinates(event);
      this.updateMarker();
    });
  }

  updateMarker() {
    this.marker.setGeometry(
      new Point(olProj.fromLonLat([this.lattitude, this.longitude]))
    );
  }

  getClickCoordinates(event: MapBrowserEvent<any>) {
    let convertedCoordinates = olProj.transform(
      event.coordinate,
      'EPSG:3857',
      'EPSG:4326'
    );
    this.form.get('jobsite_coordinates')?.setValue(convertedCoordinates);
    this.lattitude = convertedCoordinates[0];
    this.longitude = convertedCoordinates[1];
  }

  getCoordinateFromAddress() {
    this.nominatomService
      .search(this.form.get('jobsite_address')?.value)
      .pipe(timeout(1000))
      .subscribe(
        (res) => {
          let data = JSON.stringify(res);
          data = data.substring(1, data.length - 1);
          let json = JSON.parse(data);

          this.form.get('jobsite_address')?.setValue(json.display_name);
          this.form
            .get('jobsite_coordinates')
            ?.setValue([+json.lon, +json.lat]);

          this.lattitude = json.lon;
          this.longitude = json.lat;

          this.updateMarker();
        },
        (err) => {}
      );
  }
}

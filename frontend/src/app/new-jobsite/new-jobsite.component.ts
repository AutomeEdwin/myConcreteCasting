import { Component, OnInit } from '@angular/core';
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
import { Feature, MapBrowserEvent } from 'ol';
import Point from 'ol/geom/Point';

import { timeout } from 'rxjs/operators';

import { JobsitesService } from '../services/jobsites.service';
import { NominatimService } from '../services/nominatim.service';

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
  form!: FormGroup;
  concreteCastings!: FormArray;
  map!: Map;
  marker!: Feature;

  // Hardcoded data that point the Grand Place of Brussels
  lattitude = 4.352530764849208;
  longitude = 50.846642213471654;

  constructor(
    private formBuilder: FormBuilder,
    private jobsitesService: JobsitesService,
    private nominatomService: NominatimService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      jobsite_owner: localStorage.getItem('email'),
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
  }

  get f() {
    return this.form.controls;
  }

  getForm(field: string): string {
    return this.form.get(field)?.value;
  }

  get getCastingsControls() {
    return <FormArray>this.form.get('jobsite_castings');
  }

  getCasting(i: number, prop: string) {
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
    console.log(this.form.value);

    if (this.form.invalid) {
      return;
    }

    /*
    this.jobsitesService.createJobsite(this.form.value).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );*/
  }

  // MAP
  initMap() {
    const osmLayer = new TileLayer({ source: new OSM() });

    this.marker = new Feature({
      geometry: new Point(olProj.fromLonLat([this.lattitude, this.longitude])),
    });
    let markerSource = new VectorSource({
      features: [this.marker],
    });
    let markerLayer = new VectorLayer({
      source: markerSource,
    });

    this.map = new Map({
      layers: [osmLayer, markerLayer],
      view: new View({
        center: olProj.fromLonLat([4.352530764849208, 50.846642213471654]),
        zoom: 9,
      }),
      target: 'map',
    });

    this.map.on('singleclick', (event) => {
      // get new coordinates
      this.getClickCoordinates(event);
    });
  }

  updateMarker() {
    this.marker.setGeometry(
      new Point(olProj.fromLonLat([this.lattitude, this.longitude]))
    );
  }

  getClickCoordinates(event: MapBrowserEvent) {
    let convertedCoordinates = olProj.transform(
      event.coordinate,
      'EPSG:3857',
      'EPSG:4326'
    );
    this.form.get('jobsite_coordinates')?.setValue(convertedCoordinates);
    this.lattitude = convertedCoordinates[0];
    this.longitude = convertedCoordinates[1];

    this.updateMarker();
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
        (err) => {
          console.log(err);
        }
      );
  }
}

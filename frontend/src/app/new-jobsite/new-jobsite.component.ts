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
import { MapBrowserEvent } from 'ol';

import { JobsitesService } from '../services/jobsites.service';

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
  lattitude!: number;
  longitude!: number;

  constructor(
    private formBuilder: FormBuilder,
    private jobsitesService: JobsitesService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  // FIRST FORM FOR JOBSITE CREATION
  initForm(): void {
    this.form = this.formBuilder.group({
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
      concreteCastings: this.formBuilder.array([this.createConcreteCasting()]),
    });
  }

  get f() {
    return this.form.controls;
  }

  get getCastingsControls() {
    return <FormArray>this.form.get('concreteCastings');
  }

  getCasting(i: number, prop: string) {
    this.concreteCastings = this.form.get('concreteCastings') as FormArray;
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
    this.concreteCastings = this.form.get('concreteCastings') as FormArray;
    this.concreteCastings.push(this.createConcreteCasting());
  }

  removeConcreteCasting(i: number): void {
    this.concreteCastings = this.form.get('concreteCastings') as FormArray;
    this.concreteCastings.removeAt(i);
  }

  isLastArea(): boolean {
    this.concreteCastings = this.form.get('concreteCastings') as FormArray;
    return this.concreteCastings.length === 1;
  }

  onSubmit() {
    console.log(this.form.value);
    this.jobsitesService.createJobsite().subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // MAP
  initMap() {
    const osmLayer = new TileLayer({ source: new OSM() });
    const source = new VectorSource();
    const drawLayer = new VectorLayer({ source: source });

    this.map = new Map({
      layers: [osmLayer, drawLayer],
      view: new View({
        center: olProj.fromLonLat([37.41, 8.82]),
        zoom: 2,
      }),
      target: 'map',
    });

    this.map.on('singleclick', (event) => {
      // get new coordinates
      this.getClickCoordinates(event);
      // TODO draw marker on coordinates
    });
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
  }
}

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
  jobsiteForm!: FormGroup;
  concreteCastingsForm!: FormGroup;

  concreteCastings!: FormArray;

  map!: Map;
  lattitude!: number;
  longitude!: number;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initJobsiteForm();
    this.initConcreteCastingsForm();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  // FIRST FORM FOR JOBSITE CREATION
  initJobsiteForm(): void {
    this.jobsiteForm = this.formBuilder.group({
      jobsite_name: new FormControl('', [Validators.required]),
      jobsite_description: new FormControl(''),
      jobsite_coordinates: new FormControl(
        {
          lattitude: Number,
          longitude: Number,
        },
        [Validators.required]
      ),
    });
  }

  get jobsitef() {
    return this.jobsiteForm.controls;
  }

  getJobsiteDatas(key: string) {
    return this.jobsiteForm.get(key)?.value;
  }

  // SECOND FORM FOR CONCRETE CASTING CREATION
  initConcreteCastingsForm(): void {
    this.concreteCastingsForm = this.formBuilder.group({
      concreteCastings: this.formBuilder.array([this.createConcreteCasting()]),
    });
  }

  get concretef() {
    return <FormArray>this.concreteCastingsForm.get('concreteCastings');
  }

  getCastingsDatas(i: number, key: number) {
    this.concreteCastings = this.concreteCastingsForm.get(
      'concreteCastings'
    ) as FormArray;
    let val = this.concreteCastings.at(i).value;

    val = Object.keys(val).map((key) => val[key]);

    return val[key];
  }

  createConcreteCasting(): FormGroup {
    return this.formBuilder.group({
      casting_name: new FormControl('', [Validators.required]),
      casting_description: new FormControl(''),
      casting_infos: new FormControl('', [Validators.required]),
    });
  }

  addConcreteCasting(): void {
    this.concreteCastings = this.concreteCastingsForm.get(
      'concreteCastings'
    ) as FormArray;
    this.concreteCastings.push(this.createConcreteCasting());
  }

  removeConcreteCasting(i: number): void {
    this.concreteCastings = this.concreteCastingsForm.get(
      'concreteCastings'
    ) as FormArray;
    this.concreteCastings.removeAt(i);
  }

  isLastArea(): boolean {
    return this.concretef.controls.length === 1;
  }

  onSubmit() {
    console.log(this.jobsiteForm.value);
    console.log(this.concreteCastingsForm.value);
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

    this.jobsiteForm.get('jobsite_coordinates')?.setValue(convertedCoordinates);
    this.lattitude = convertedCoordinates[0];
    this.longitude = convertedCoordinates[1];
  }
}

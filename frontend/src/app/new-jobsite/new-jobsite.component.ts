import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
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
})
export class NewJobsiteComponent implements OnInit {
  form!: FormGroup;
  concreteAreas!: FormArray;

  map!: Map;
  lattitude: number = 0;
  longitude: number = 0;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initMap();
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      jobsite_description: new FormControl(''),
      coordinates: new FormControl(''),
      concreteAreas: this.formBuilder.array([this.createConcreteArea()]),
    });
  }

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
      // remove old point
      // draw new point
    });
  }

  getClickCoordinates(event: MapBrowserEvent) {
    let convertedCoordinates = olProj.transform(
      event.coordinate,
      'EPSG:3857',
      'EPSG:4326'
    );
    this.lattitude = convertedCoordinates[0];
    this.longitude = convertedCoordinates[1];
  }

  createConcreteArea(): FormGroup {
    return this.formBuilder.group({
      name: '',
      concreteare_description: '',
    });
  }

  addConcreteArea(): void {
    this.concreteAreas = this.form.get('concreteAreas') as FormArray;
    this.concreteAreas.push(this.createConcreteArea());
  }

  onSubmit() {
    console.log(this.form.value);
  }
}

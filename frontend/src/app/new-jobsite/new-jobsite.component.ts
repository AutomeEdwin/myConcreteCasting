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

  concreteArray!: FormArray;

  map!: Map;
  lattitude: number = 0;
  longitude: number = 0;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initMap();
    this.initForm();
  }

  /**
   * Helper function for easier access to form fields
   */
  get f() {
    return this.form.controls;
  }

  get getAreasControls() {
    return <FormArray>this.form.get('concreteAreas');
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      jobsite_name: new FormControl('', [Validators.required]),
      jobsite_description: new FormControl(''),
      jobsite_coordinates: new FormControl(''),
      concreteAreas: this.formBuilder.array(
        [this.createConcreteArea()],
        [Validators.required]
      ),
    });
  }

  createConcreteArea(): FormGroup {
    return this.formBuilder.group({
      area_name: new FormControl(''),
      area_description: new FormControl(''),
      area_infos: new FormControl(''),
    });
  }

  addConcreteArea(): void {
    this.concreteArray = this.form.get('concreteAreas') as FormArray;
    this.concreteArray.push(this.createConcreteArea());
  }

  removeConcreteArea(i: number): void {
    this.concreteArray = this.form.get('concreteAreas') as FormArray;
    this.concreteArray.removeAt(i);
  }

  lastArea(): boolean {
    return this.getAreasControls.controls.length === 1;
  }

  onSubmit() {
    console.log(this.form.value);
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
    this.lattitude = convertedCoordinates[0];
    this.longitude = convertedCoordinates[1];
  }
}

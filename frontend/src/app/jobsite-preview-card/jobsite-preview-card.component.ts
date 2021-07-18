import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import Map from 'ol/Map';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import * as olProj from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Feature, MapBrowserEvent } from 'ol';
import Point from 'ol/geom/Point';
import { Fill, Stroke, Circle, Style } from 'ol/style';

import { Jobsite } from '../models/jobsite.model';
import { JobsitesService } from '../services/jobsites.service';
import { ConfirmJobsiteDeleteComponent } from '../confirm-jobsite-delete/confirm-jobsite-delete.component';

@Component({
  selector: 'app-jobsite-preview-card',
  templateUrl: './jobsite-preview-card.component.html',
  styleUrls: ['./jobsite-preview-card.component.scss'],
})
export class JobsitePreviewCardComponent implements OnInit {
  @Input() jobsite!: Jobsite;

  map!: Map;
  marker!: Feature;

  constructor(
    private router: Router,
    private jobsiteService: JobsitesService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    // this.initMap();
  }

  getJobsiteName() {
    return this.jobsite.getName();
  }

  getJobsiteDescription() {
    return this.jobsite.getDescription();
  }

  getJobsiteAddress() {
    return this.jobsite.getAddress();
  }

  getJobsiteCoordinates() {
    return this.jobsite.getCoordinates();
  }

  onDelete() {
    const dialog = this.dialog.open(ConfirmJobsiteDeleteComponent);

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.jobsiteService.deleteJobsite(this.jobsite.getId()).subscribe(
          (res) => {
            // TODO refresh dahsboard
          },
          (err) => {}
        );
      }
    });
  }

  onDetail() {
    this.router.navigate(['jobsite/', this.jobsite.getId()]);
  }

  /*initMap() {
    const osmLayer = new TileLayer({ source: new OSM() });

    this.marker = new Feature({
      geometry: new Point(
        olProj.fromLonLat([
          +this.jobsite.getCoordinates()[0],
          +this.jobsite.getCoordinates()[1],
        ])
      ),
    });
    var markerStyles = [
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
      }),
    ];
    this.marker.setStyle(markerStyles);

    let markerSource = new VectorSource({
      features: [this.marker],
    });
    let markerLayer = new VectorLayer({
      source: markerSource,
    });

    this.map = new Map({
      controls: [],
      layers: [osmLayer, markerLayer],
      view: new View({
        center: olProj.fromLonLat([
          +this.jobsite.getCoordinates()[0],
          +this.jobsite.getCoordinates()[1],
        ]),
        zoom: 17,
      }),
      target: 'map',
    });
  }*/
}

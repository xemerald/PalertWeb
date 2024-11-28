import { Component, OnInit, AfterViewInit, ViewContainerRef } from '@angular/core';

import { StationsService } from './services/stations.service';
import { FocusMapService } from './services/map.service';
import { FocusMarkerService } from './services/marker.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

	constructor(
		private stationsService: StationsService,
		private mapService: FocusMapService,
		private markerService: FocusMarkerService,
		private viewContainerRef: ViewContainerRef
	) { }

	ngOnInit(): void {
		this.stationsService.initialize();
	}

	ngAfterViewInit(): void {
		this.markerService.initialize(this.mapService.getNativeMap(), this.viewContainerRef);
		//this.mapService.panMapTo({ lat: 24.772, lng: 120.976 }, 17);
	}
}

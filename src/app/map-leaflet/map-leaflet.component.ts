import { Component, OnInit } from '@angular/core';

import { Controls } from '../services/map.service'
import { MapLeafletService } from './map-leaflet.service';

@Component({
	selector: 'app-map-leaflet',
	templateUrl: './map-leaflet.component.html',
	styleUrls: ['./map-leaflet.component.css']
})
export class MapLeafletComponent implements OnInit {
	constructor(
		public mapService: MapLeafletService,
	) { }

	ngOnInit(): void {
		let main = document.getElementById('map') as HTMLElement;
		let menu: Controls = {
			element: document.getElementById('menu') as HTMLElement,
			position: 'topleft'
		};
		let modal: Controls = {
			element: document.getElementById('modal') as HTMLElement,
			position: 'topleft'
		};

		this.mapService.initialize(main, menu, modal);
	}
}

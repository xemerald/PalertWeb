import { Injectable } from '@angular/core';

import { FocusMapService } from './map.service';
import { FocusMarkerService } from './marker.service';

@Injectable({
    providedIn: 'root'
})
export class PositionService {
	private posWatcher: any;

    constructor(
        private mapService: FocusMapService,
        private markerService: FocusMarkerService
    ) { }

    showPosition() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					let pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
					this.mapService.panMapTo(pos, 13);
                    this.markerService.setPosMarkers(this.mapService.getNativeMap(), position);
				}, () => {
					this.handleLocationError(true);
				}, {timeout: 15000, maximumAge: 60000}
			);
		} else {
			this.handleLocationError(false);
		}
	}

	trackPosition() {
		if (navigator.geolocation) {
			this.posWatcher = navigator.geolocation.watchPosition(
					(position) => {
						let pos = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};
                        this.markerService.setPosMarkers(this.mapService.getNativeMap(), position);
					},() => {
						this.handleLocationError(true);
					}, {timeout: 15000, maximumAge: 60000}
				);
		} else {
			this.handleLocationError(false);
		}
	}

	untrackPosition() {
		if (navigator.geolocation) {
			navigator.geolocation.clearWatch(this.posWatcher);
		}
	}

	handleLocationError(browserHasGeolocation: boolean) {
		alert(browserHasGeolocation ?
			'Positioning service failed.' :
			'Your browser doesn\'t support geolocation.');
	}
}

import { Injectable, ViewContainerRef } from '@angular/core';

//import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { MapGoogleService } from './map-google.service';
import { MarkerService } from '../services/marker.service';
import { StationsService } from '../services/stations.service';
import { InfoWindowFactory, InfoWindowItem } from '../infowindow.factory';
import { DataWindowComponent } from '../data-window/data-window.component';
import { ShakeWindowComponent } from '../shake-window/shake-window.component';
import { ModbusWindowComponent } from '../modbus-window/modbus-window.component';
import { NormalIcon, ClusterIcon, PosIcon }  from '../icon';

declare let MarkerClusterer: any;

@Injectable({
    providedIn: 'root'
})
export class MarkerGoogleService implements MarkerService {
    private markers: Array<any> = [];
	private posMarker: any = null;
	private infoWindow: any = null;
	private markerCluster: any = null;
    private viewContainerRef!: ViewContainerRef;

    constructor(
		private stationsService: StationsService,
		private mapService: MapGoogleService,
		private infoWindowFactory: InfoWindowFactory
	) {	}

    /**
     * 
     * @param map 
     * @param viewContainerRef 
     */
    initialize(map: any, viewContainerRef: ViewContainerRef): void {
        /* */
        this.viewContainerRef = viewContainerRef;
	/* */
        (function(this: any) {
			this.status = new Boolean(false);
			this.setStatus = function(input: boolean) {
				this.status = Boolean(input);
			};
			this.getStatus = function() {
				return this.status;
			}
		}).call(google.maps.Marker.prototype);

		this.resetInfoWindow();
		this.genStationMarkers(map, NormalIcon, true);
    }

    /**
     * 
     */
    resetInfoWindow(): void {
        if (this.infoWindow) {
			this.infoWindow.close();
			google.maps.event.trigger(this.infoWindow, 'closeclick');
			google.maps.event.trigger(this.infoWindow, 'content_changed');
			google.maps.event.clearInstanceListeners(this.infoWindow);
			this.infoWindow = null;
		}
		this.infoWindow = new google.maps.InfoWindow;
		google.maps.event.addListener(this.infoWindow, 'closeclick', () => {
			this.infoWindowFactory.destroyWindow();
		});
    }

    /**
     * 
     * @param map 
     * @param lat 
     * @param lng 
     * @param title 
     * @param icon 
     * @returns 
     */
    createMarker(map: any, lat: number, lng: number, title: string, icon: any): any {
        let position = new google.maps.LatLng(lat, lng);
		let marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			icon: icon,
		});

		return marker;
    }

    /**
     * 
     * @param map 
     * @param marker 
     * @param html 
     */
    openInfoWindow(map: any, marker: any, html: any): void {
        this.infoWindow.setContent(html);
		this.mapService.panMapTo(marker.getPosition());
		this.infoWindow.open(map, marker);
    }

    /**
     * 
     * @param map 
     */
    bindShakeWindow(map: any): void {
        for (let i = 0, len = this.markers.length; i < len; i++) {
			google.maps.event.clearInstanceListeners(this.markers[i]);
			google.maps.event.addListener(this.markers[i], 'click', () => {
				let infoWindowItem: InfoWindowItem = {
					component: ShakeWindowComponent,
					data: {
						index: i,
						title: this.markers[i].getTitle()
					}
				};
				this.infoWindowFactory.destroyWindow();
				this.openInfoWindow(
					map, this.markers[i], this.infoWindowFactory.createWindow(infoWindowItem, this.viewContainerRef)
				);
			})
		}
    }

    /**
     * 
     * @param map 
     * @param icon 
     * @param create 
     */
    genStationMarkers(map: any, icon: Object, create: boolean): void {
        this.stationsService
        .getStations()
        .then(
            stations => {
                for (let i = 0, len = stations.length; i < len; i++) {
                    let marker = create ? this.createMarker(
                        map,
                        stations[i].latitude,
                        stations[i].longitude,
                        stations[i].station + " " + stations[i].locname,
                        icon
                    ) : this.markers[i];
                    let data = { index: i, title: marker.getTitle() };

                    google.maps.event.clearInstanceListeners(marker);
                    google.maps.event.addListener(marker, 'click', () => {
                        let infoWindowItem: InfoWindowItem = {
                            component: DataWindowComponent,
                            data: data
                        };
                        this.openInfoWindow(
                            map, marker, this.infoWindowFactory.createWindow(infoWindowItem, this.viewContainerRef)
                        );
                    });
                    google.maps.event.addListener(marker, 'dblclick', () => {
                        let infoWindowItem: InfoWindowItem = {
                            component: ModbusWindowComponent,
                            data: data
                        };
                        this.openInfoWindow(
                            map, marker, this.infoWindowFactory.createWindow(infoWindowItem, this.viewContainerRef)
                        );
                    });

                    if (create)
                        this.markers.push(marker);
                    else
                        this.setMarkersIcon(i, icon);
                }

                if (create) this.initialCluster(map);
            }
        );
    }

    /**
     * 
     * @param map 
     * @param index 
     * @returns 
     */
    pickMarker(map: any, index: number): any {
        let position = this.markers[index].getPosition();

		if (this.markerCluster.getTotalMarkers() > 0) {
			this.markerCluster.removeMarker(this.markers[index]);
			this.markers[index].setMap(this.markerCluster.getMap());
		}

		google.maps.event.trigger(this.markers[index], 'click');
		google.maps.event.addListenerOnce(this.infoWindow, 'content_changed', () => {
			this.markers[index].setAnimation(null);
			if (this.markerCluster.getTotalMarkers() > 0)
				this.markerCluster.addMarker(this.markers[index], false);
		});

		this.markers[index].setAnimation(google.maps.Animation.BOUNCE);

		return position;
    }

    /**
     * 
     * @param index 
     * @param icon 
     */
    setMarkersIcon(index?: number, icon?: any): void {
        if (icon == null) {
			icon = NormalIcon;
		}

		if (index != null) {
			this.markers[index].setIcon(icon);
		}
		else {
			for (let i = 0, len = this.markers.length; i < len; i++) {
				this.markers[i].setIcon(icon);
			}
		}
    }

    /**
     * 
     * @param index 
     * @returns 
     */
    getMarkersIcon(index?: number): string {
        if (index == null) {
			return NormalIcon.url;
		}
		else {
			let icon = this.markers[index].getIcon();
			if (icon == null) return NormalIcon.url;
			else return icon.url;
		}
    }

    /**
     * 
     * @param index 
     * @returns 
     */
    checkMarkersVisbility(index?: number): boolean {
        if (index != null) {
			return this.markers[index].getVisible();
		}
		else {
			return this.markers.every(marker => marker.getVisible());
		}
    }

    /**
     * 
     * @param visibility 
     * @param index 
     * @returns 
     */
    setMarkersVisbility(visibility: boolean, index?: number): number {
        if (index != null) {
			if (this.markers[index].getVisible() != visibility) {
				this.markers[index].setVisible(visibility);
			}
			return index;
		}
		else {
			for (let i = 0, len = this.markers.length; i < len; i++) {
				if (this.markers[i].getVisible() != visibility) {
					this.markers[i].setVisible(visibility);
				}
			}
		}

		return this.markers.length;
    }

    /**
     * 
     * @returns 
     */
    revertAllMarkersVisibility(): number {
		return this.setMarkersVisbility(this.checkMarkersVisbility() ? false : true);
    }

    /**
     * 
     * @param index 
     */
    checkMarkersStatus(index?: number): boolean {
		if (index != null) {
			return this.markers[index].getStatus();
		}
		else {
			return this.markers.every(marker => marker.getStatus());
		}
    }

    /**
     * 
     * @param status 
     * @param index 
     * @returns 
     */
    setMarkersStatus(status: boolean, index?: number): number {
		if (index != null) {
			this.markers[index].setStatus(status);
			return index;
		}
		else {
			for (let i = 0, len = this.markers.length; i < len; i++) {
				this.markers[i].setStatus(status);
			}
		}

		return this.markers.length;
    }

    /**
     * 
     * @param index 
     */
    getMarkersTitle(index?: number): string[] {
        if (index != null) {
			return this.markers[index].getTitle();
		}
		else {
			return this.markers.map(marker => marker.getTitle());
		}
    }

    /**
     * 
     * @param map 
     * @param pos 
     */
    setPosMarkers(map: any, pos: GeolocationPosition): void {
        if (this.posMarker != null) {
			let point = new google.maps.LatLng(
				pos.coords.latitude,
				pos.coords.longitude
			);
			this.posMarker.setPosition(point);
		}
		else {
			this.posMarker =
				this.createMarker(
					map,
					pos.coords.latitude,
					pos.coords.longitude,
					pos.timestamp.toString(),
					PosIcon
				);
		}
    }

    /**
     * 
     * @param map 
     */
    initialCluster(map: any): void {
    }

    /**
     * 
     * @param sw 
     */
    switchCluster(sw: boolean): void {
    }
}

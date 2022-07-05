import { Injectable, ViewContainerRef } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import { MarkerService } from '../services/marker.service';
import { StationsService } from '../services/stations.service';
import { MapLeafletService } from './map-leaflet.service';
import { InfoWindowFactory, InfoWindowItem } from '../infowindow.factory';
import { DataWindowComponent } from '../data-window/data-window.component';
import { ShakeWindowComponent } from '../shake-window/shake-window.component';
import { ModbusWindowComponent } from '../modbus-window/modbus-window.component';
import { NormalIcon, PosIcon }  from '../icon';

@Injectable({
  providedIn: 'root'
})
export class MarkerLeafletService implements MarkerService {
    private markers: Array<any> = [];
	private posMarker: any = null;
	private infoWindow: any = null;
	private markerCluster: any = null;
	private infoWindowObserver: any = null;
    private viewContainerRef!: ViewContainerRef;

	constructor(
		private stationsService: StationsService,
		private mapService: MapLeafletService,
        private infoWindowFactory: InfoWindowFactory
	) {}

	initialize(map: any, viewContainerRef: ViewContainerRef): void {
    /* */
        this.viewContainerRef = viewContainerRef;
	/* */
        (function(this: any) {
		/* */
			this.status = new Boolean(false);
			this.setStatus = function(input: boolean) {
				this.status = Boolean(input);
			};
			this.getStatus = function() {
				return this.status;
			};
		/* */
			this.getVisible = function() {
				return this.options.opacity > 0.0;
			};
			this.setVisible = function(visibility: boolean) {
				this.setOpacity(visibility ? 1.0 : 0.0);
			}
		}).call(L.Marker.prototype);

		this.resetInfoWindow();
		this.genStationMarkers(map, NormalIcon, true);
	}

	resetInfoWindow(): void {
		if ( this.infoWindow ) {
			this.infoWindow.close();
			this.infoWindow.off();
			this.infoWindow = null;
			this.infoWindowObserver.disconnect();
			this.infoWindowObserver = null;
		}
	/* */
		this.infoWindow = new L.Popup({
			minWidth: 128,
			maxWidth: 320,
            autoPan: false
		});
	/* */
		this.infoWindowObserver = new MutationObserver( () => this.infoWindow.update() );
	/* */
		this.infoWindow.on('contentupdate', () => {
			this.infoWindowObserver.observe(this.infoWindow.getContent(), {
				childList: true,
				subtree: true,
				characterData: true
			});
		});
	/* */
		this.infoWindow.on('remove', () => {
			this.infoWindowObserver.disconnect();
			this.infoWindowFactory.destroyWindow();
		});
	}

	createMarker(map: any, lat: number, lng: number, title: string, icon: any): any {
		let marker = new L.Marker(
			[lat, lng],
			{
				title: title,
				icon: L.icon({
					iconUrl: icon.url,
					iconAnchor: icon.anchor,
				})
			}
		);

		return marker;
	}

	openInfoWindow(map: any, marker: any, html: any): void {
		let latlng = marker.getLatLng();
		let [x, y] = marker.options.icon.options.iconAnchor;
		let offset = new L.Point(0.5, y * -0.9);

		this.infoWindow.options.offset = offset;
		this.infoWindow
			.setLatLng(latlng)
			.setContent(html)
			.openOn(map);

		this.mapService.panMapTo(latlng);
	}

	bindShakeWindow(map: any): void {
		for (let i = 0, len = this.markers.length; i < len; i++) {
			this.markers[i].off();
			this.markers[i].on('click', () => {
				let infoWindowItem: InfoWindowItem = {
					component: ShakeWindowComponent,
					data: {
						index: i,
						title: this.markers[i].options.title
					}
				};
				this.infoWindowFactory.destroyWindow();
				this.openInfoWindow(
					map, this.markers[i], this.infoWindowFactory.createWindow(infoWindowItem, this.viewContainerRef)
				);
			})
		}
	}

	genStationMarkers(map: any, icon: Object, create: boolean): void {
		this.stationsService
			.getStations()
			.then(
				stations => {
					for (let i = 0, len = stations.length; i < len; i++) {
						let title = stations[i].station + " " + stations[i].locname;
						let marker = create ? this.createMarker(
							map,
							stations[i].latitude,
							stations[i].longitude,
							title,
							icon
						) : this.markers[i];
						let data = { index: i, title: title };

						marker.off();
						marker.on('click', () => {
							let infoWindowItem: InfoWindowItem = {
								component: DataWindowComponent,
								data: data
							};
                            this.infoWindowFactory.destroyWindow();
							this.openInfoWindow(
								map, marker, this.infoWindowFactory.createWindow(infoWindowItem, this.viewContainerRef)
							);
						});
						marker.on('dblclick', () => {
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

	pickMarker(map: any, index: number): any {
        if (index < 0) 
            return [0, 0];

		let position = this.markers[index].getLatLng();

		if (this.markerCluster.hasLayer(this.markers[index])) {
			this.markerCluster.zoomToShowLayer(this.markers[index], () => {
				this.markers[index].fire('click');
			});
		}
		else {
			this.markers[index].fire('click');
		}

		return position;
	}

	setMarkersIcon(index?: number, icon?: any): void {
		let _icon =  L.icon({
			iconUrl: icon ? icon.url : NormalIcon.url,
			iconAnchor: icon ? icon.anchor : NormalIcon.anchor,
		});

		if (index != null) {
			this.markers[index].setIcon(_icon);
		}
		else {
			for (let i = 0, len = this.markers.length; i < len; i++) {
				this.markers[i].setIcon(_icon);
			}
		}
	}

	getMarkersIcon(index?: number): string {
		if (index == null) {
			return NormalIcon.url;
		}
		else {
			let icon = this.markers[index].getIcon();
			if (icon == null) return NormalIcon.url;
			else return icon.options.iconUrl;
		}
	}

	checkMarkersVisbility(index?: number): boolean {
		if (index != null) {
			return this.markers[index].getVisible();
		}
		else {
			return this.markers.every(marker => marker.getVisible());
		}
	}

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

	revertAllMarkersVisibility(): number {
		return this.setMarkersVisbility(this.checkMarkersVisbility() ? false : true);
	}

	checkMarkersStatus(index?: number): boolean {
		if (index != null) {
			return this.markers[index].getStatus();
		}
		else {
			return this.markers.every(marker => marker.getStatus());
		}
	}

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

	getMarkersTitle(index?: number): string[] {
		if (index != null) {
			return this.markers[index].options.title;
		}
		else {
			return this.markers.map(marker => marker.options.title);
		}
	}

	setPosMarkers(map: any, pos: GeolocationPosition): void {
		if (this.posMarker != null) {
			let point = new L.LatLng(
				pos.coords.latitude,
				pos.coords.longitude
			);
			this.posMarker.setLatLng(point);
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

			this.posMarker.addTo(map);
		}
	}

	initialCluster(map: any): void {
        this.markerCluster = L.markerClusterGroup({
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: false,
            disableClusteringAtZoom: 11,
            maxClusterRadius: 70,
            iconCreateFunction: cluster => {
                let className = 'marker-cluster-';
                let size = 50;
                let index = 0;
                let count = cluster.getChildCount();
                let dv = count;

                while (dv !== 0) {
                    dv = parseInt(String(dv/5), 10);
                    index++;
                }

                index = Math.min(index, 5) - 1;
                className += String(index);
                size += index * 5;
                return L.divIcon({
                    html: '<div><span><b>' + count + '</b></span></div>',
                    className: 'marker-cluster ' + className,
                    iconSize: L.point(size, size)
                });
            }
        });
        this.markerCluster
            .addLayers(this.markers)
            .addTo(map);
	}

	switchCluster(sw: boolean): void {
		if (sw) {
			this.markerCluster.clearLayers();
			for (let i = 0, len = this.markers.length; i < len; i++) {
				this.markers[i].remove();
			}
			this.markerCluster.addLayers(this.markers);
		}
		else {
            this.markerCluster.clearLayers();
            for (let i = 0, len = this.markers.length; i < len; i++) {
                this.markers[i].addTo(this.mapService.getNativeMap());
            }
		}
	}
}

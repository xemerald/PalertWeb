import { Injectable, ViewContainerRef } from '@angular/core';

import { MarkerLeafletService } from '../map-leaflet/marker-leaflet.service';
import { MarkerGoogleService } from '../map-google/marker-google.service';

export interface MarkerService {
	initialize(map: any, viewContainerRef: ViewContainerRef): void;
	resetInfoWindow(): void;
	createMarker(map: any, lat: number, lng: number, title: string, icon: any): any;
	openInfoWindow(map: any, marker: any, html: any): void;
	bindShakeWindow(map: any): void;
	genStationMarkers(map: any, icon: Object, create: boolean): void;
	pickMarker(map: any, index: number): any;
	setMarkersIcon(index?: number, icon?: any): void;
	getMarkersIcon(index?: number): string;
	checkMarkersVisbility(index?: number): boolean;
	setMarkersVisbility(visibility: boolean, index?: number): number;
	revertAllMarkersVisibility(): number;
	checkMarkersStatus(index?: number): boolean;
	setMarkersStatus(status: boolean, index?: number): number;
	getMarkersTitle(index?: number): string[];
	setPosMarkers(map: any, pos: GeolocationPosition): void;
	initialCluster(map: any): void;
	switchCluster(sw: boolean): void;
}

@Injectable({
	providedIn: 'root'
})
export class FocusMarkerService implements MarkerService {
	private currentService!: MarkerService;
	private currentMode!: number;

	get mode(): number {
		return this.currentMode;
	}

	set mode(value: number) {
		this.currentMode = value;
		switch (value) {
		case 0:
			this.currentService = this.markerLeafletService;
			break;
		case 1:
			this.currentService = this.markerGoogleService;
		}
	}

	constructor(
		private markerLeafletService: MarkerLeafletService,
		private markerGoogleService: MarkerGoogleService
	) {
		this.mode = 0;
	}

/**
 *
 * @param map
 * @param viewContainerRef
 */
	initialize(map: any, viewContainerRef: ViewContainerRef): void {
		this.currentService.initialize(map, viewContainerRef);
	}

/**
 *
 */
	resetInfoWindow(): void {
		this.currentService.resetInfoWindow();
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
		return this.currentService.createMarker(map, lat, lng, title, icon);
	}

/**
 *
 * @param map
 * @param marker
 * @param html
 */
	openInfoWindow(map: any, marker: any, html: any): void {
		this.currentService.openInfoWindow(map, marker, html);
	}

/**
 *
 * @param map
 */
	bindShakeWindow(map: any): void {
		this.currentService.bindShakeWindow(map);
	}

/**
 *
 * @param map
 * @param icon
 * @param create
 */
	genStationMarkers(map: any, icon: Object, create: boolean): void {
		this.currentService.genStationMarkers(map, icon, create);
	}

/**
 *
 * @param map
 * @param index
 * @returns
 */
	pickMarker(map: any, index: number): any {
		return this.currentService.pickMarker(map, index);
	}

/**
 *
 * @param index
 * @param icon
 */
	setMarkersIcon(index?: number, icon?: any): void {
		this.currentService.setMarkersIcon(index, icon);
	}

/**
 *
 * @param index
 * @returns
 */
	getMarkersIcon(index?: number): string {
		return this.currentService.getMarkersIcon(index);
	}

/**
 *
 * @param index
 * @returns
 */
	checkMarkersVisbility(index?: number): boolean {
		return this.currentService.checkMarkersVisbility(index);
	}

/**
 *
 * @param visibility
 * @param index
 * @returns
 */
	setMarkersVisbility(visibility: boolean, index?: number): number {
		return this.currentService.setMarkersVisbility(visibility, index);
	}

/**
 *
 * @returns
 */
	revertAllMarkersVisibility(): number {
		return this.currentService.revertAllMarkersVisibility();
	}

/**
 *
 * @param index
 */
	checkMarkersStatus(index?: number): boolean {
		return this.currentService.checkMarkersStatus(index);
	}

/**
 *
 * @param status
 * @param index
 * @returns
 */
	setMarkersStatus(status: boolean, index?: number): number {
		return this.currentService.setMarkersStatus(status, index);
	}

/**
 *
 * @param index
 */
	getMarkersTitle(index?: number): string[] {
		return this.currentService.getMarkersTitle(index);
	}

/**
 *
 * @param map
 * @param pos
 */
	setPosMarkers(map: any, pos: GeolocationPosition): void {
		this.currentService.setPosMarkers(map, pos);
	}

/**
 *
 * @param map
 */
	initialCluster(map: any): void {
		this.currentService.initialCluster(map);
	}

/**
 *
 * @param sw
 */
	switchCluster(sw: boolean): void {
		this.currentService.switchCluster(sw);
	}
}

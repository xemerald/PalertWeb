import { Injectable } from '@angular/core';

import { MapGoogleService } from '../map-google/map-google.service';
import { MapLeafletService } from '../map-leaflet/map-leaflet.service';
import { MapStylesName } from '../map-style';

export interface Controls {
	element: HTMLElement;
	position: L.ControlPosition;
};

export interface MapService {
/* */
	initialize(container: HTMLElement, ...controls: Controls[]): void;
/* */
	createMap(el: HTMLElement): any;
/* */
	pushMapControl(control: Controls): void;
/* */
	setMapOptions(options: Object): void;
/* */
	switchMapLayers(style: MapStylesName): void;
/* */
	panMapTo(position: any, zoom?: number): void;
/* */
	getNativeMap(): any;
}

@Injectable({
    providedIn: 'root'
})
export class FocusMapService implements MapService {
	private currentService!: MapService;
	private currentMode!: number;

/**
 *
 */
	get mode(): number {
		return this.currentMode;
	}

/**
 *
 */
	set mode(value: number) {
		this.currentMode = value;
		switch (value) {
			case 0:
				this.currentService = this.mapLeafletService;
				break;
			case 1:
				this.currentService = this.mapGoogleService;
		}
	}

	constructor(
		private mapLeafletService: MapLeafletService,
		private mapGoogleService: MapGoogleService
	) {
		this.mode = 0;
	}

/**
 *
 * @param container
 * @param controls
 */
	initialize(container: HTMLElement, ...controls: Controls[]): void {
		this.currentService.initialize(container, ...controls);
	}

/**
 *
 * @param el
 * @returns
 */
	createMap(el: HTMLElement): any {
		return this.currentService.createMap(el);
	}

/**
 *
 * @param control
 */
	pushMapControl(control: Controls): void {
		this.currentService.pushMapControl(control);
	}

/**
 *
 * @param options
 */
	setMapOptions(options: Object): void {
		this.currentService.setMapOptions(options);
	}

/**
 *
 * @param style
 */
	switchMapLayers(style: MapStylesName): void {
		this.currentService.switchMapLayers(style);
	}

/**
 *
 * @param position
 * @param zoom
 */
	panMapTo(position: any, zoom?: number): void {
		this.currentService.panMapTo(position, zoom);
	}

/**
 *
 * @returns
 */
	getNativeMap(): any {
		return this.currentService.getNativeMap();
	}
}

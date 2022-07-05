import { Injectable } from '@angular/core';

import { MapService, Controls } from '../services/map.service';
import { MapStylesName, MapStyles } from '../map-style';

export enum ControlPosition {
	TOP_LEFT = 1,
	TOP_CENTER,
	TOP_RIGHT,
	LEFT_CENTER,
	LEFT_TOP,
	LEFT_BOTTOM,
	RIGHT_TOP,
	RIGHT_CENTER,
	RIGHT_BOTTOM,
	BOTTOM_LEFT,
	BOTTOM_CENTER,
	BOTTOM_RIGHT
}

@Injectable({
    providedIn: 'root'
})
export class MapGoogleService implements MapService {
    private map: any;
	private mapResolver!: (map?: any) => void;

    constructor() {
		this.map =
			new Promise<any>((resolve: (map: any) => void) => { this.mapResolver = resolve; });
	}

    /**
     * 
     * @param container 
     * @param controls 
     */
    initialize(container: HTMLElement, ...controls: Controls[]): void {
        const map = this.createMap(container);

        for (let i = 0, len = controls.length; i < len; i++) {
            this.pushMapControl(controls[i]);
        }

        this.mapResolver(map);
    }

    /**
     * 
     * @param el 
     * @returns 
     */
    createMap(el: HTMLElement): any {
		let map = new google.maps.Map(el, {
			zoom: 8,
			minZoom: 6,
			center: { lat: 23.772, lng: 120.976 },
			gestureHandling: "greedy",
			streetViewControl: false,
			mapTypeControl: false,
			zoomControl: false,
			scaleControl: true,
			styles: MapStyles[MapStylesName.NormalStyle].google
		});
		return map;
    }

    /**
     * 
     * @param control 
     */
    pushMapControl(control: Controls): void {
		let position = control.position;
		this.map.controls[position].push(control.element);
    }

    /**
     * 
     * @param options 
     */
    setMapOptions(options: Object): void {
		this.map.setOptions(options);
    }

    /**
     * 
     * @param style 
     */
    switchMapLayers(style: MapStylesName): void {
        this.setMapOptions(MapStyles[style].google);
    }

    /**
     * 
     * @param position 
     * @param zoom 
     */
    panMapTo(position: any, zoom?: number): void {
        this.map.panTo(position);
        if (zoom) {
            if (this.map.getZoom() < zoom) this.map.setZoom(zoom);
        }
    }

    /**
     * 
     * @returns 
     */
    getNativeMap(): any {
        return this.map;
    }
}

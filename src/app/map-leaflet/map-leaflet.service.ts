import { Injectable } from '@angular/core';

import * as L from 'leaflet';
import { MapService, Controls } from '../services/map.service';
import { MapStylesName, MapStyles } from '../map-style';

export const _ControlPosition = {
	TOP_LEFT: 'topleft',
	TOP_RIGHT: 'topright',
	BOTTOM_LEFT: 'bottomleft',
	BOTTOM_RIGHT: 'bottomright'
};

@Injectable({
    providedIn: 'root'
})
export class MapLeafletService implements MapService {
    private map: any;
	private mapLayers: Array<any> = [];

    constructor() {
        for ( let style in MapStyles ) {
            this.mapLayers.push(
                L.tileLayer(MapStyles[style].leaflet.url, MapStyles[style].leaflet.options)
            );
        }
    }

    initialize(container: HTMLElement, ...controls: Controls[]): void {
        this.map = this.createMap(container);

        for (let i = 0, len = controls.length; i < len; i++) {
            this.pushMapControl(controls[i]);
        }
    }

    createMap(el: HTMLElement): any {
        let map = L.map(el, {
            center:	[23.772, 120.976],
            maxBounds: [[26.772, 117.976],[20.772, 123.976]],
            zoomControl: false,
            zoom: 8,
            minZoom: 6,
            maxZoom: 18,
            closePopupOnClick: false
        });
        let scale = L.control.scale({
            imperial: false
        });
    /* */
        map.addLayer(this.mapLayers[MapStylesName.NormalStyle]);
        map.addControl(scale);

        return map;
    }

    pushMapControl(control: Controls): void {
        let _control = new L.Control({
            position: control.position
        });

        _control.onAdd = () => {
            return control.element;
        }
        _control.addTo(this.map);
    }

    setMapOptions(options: Object): void {
        this.map.setOptions(options);
    }

    switchMapLayers(style: MapStylesName): void {
        for ( let layer in this.mapLayers ) {
            this.map.removeLayer(this.mapLayers[layer]);
        }
        this.map.addLayer(this.mapLayers[style]);
    }

    panMapTo(position: any, zoom?: number): void {
        this.map.setView(position, zoom);
        if ( zoom  && this.map.getZoom() < zoom )
            this.map.setZoom(zoom);
    }

    getNativeMap(): L.Map { return this.map; }
}

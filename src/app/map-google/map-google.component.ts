import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIKey } from './google-map-api-key';
import { MapStylesName, MapStyles } from '../map-style';

export interface Controls {
	element: HTMLElement;
	position: google.maps.ControlPosition;
}
@Component({
    selector: 'app-map-google',
    templateUrl: './map-google.component.html',
    styleUrls: ['./map-google.component.css']
})
export class MapGoogleComponent {
    apiLoaded: Observable<boolean>;
    private map!: Promise<google.maps.Map>;
    private mapResolver!: (map: google.maps.Map) => void;

    options: google.maps.MapOptions = {
        zoom: 8,
        minZoom: 6,
        maxZoom: 18,
        center: { lat: 23.772, lng: 120.976 },
        gestureHandling: "greedy",
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: false,
        scaleControl: true,
        styles: MapStyles['NormalStyle'].google
    };

    constructor( private http: HttpClient ) {
        this.apiLoaded = this.http.jsonp(
            'https://maps.googleapis.com/maps/api/js?key=' + APIKey,
            'callback'
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
        this.map =
            new Promise<any>((resolve: (value: google.maps.Map) => void) => { this.mapResolver = resolve; });
    }

    onMapReady(map: google.maps.Map): void {
        this.mapResolver(map);

        let menu: Controls = {
            element: document.getElementById('menu') as HTMLElement,
            position: google.maps.ControlPosition.TOP_LEFT
        };
        let modal: Controls = {
            element: document.getElementById('modal') as HTMLElement,
            position: google.maps.ControlPosition.TOP_LEFT
        };
    }
}

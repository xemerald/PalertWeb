import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Station } from '../station';
import { StationsService } from '../services/stations.service';
import { InfoWindowComponent } from '../infowindow.factory';

@Component({
    selector: 'app-data-window',
    templateUrl: './data-window.component.html',
    styleUrls: ['./data-window.component.css']
})
export class DataWindowComponent implements OnInit, OnDestroy, InfoWindowComponent {
	@Input() data: any;

	index!: number;
	title!: string;
	editFlag: boolean = false;
	_station?: Station;

    constructor(
        private http: HttpClient,
		private stationsService: StationsService
    ) { }

    ngOnInit(): void {
        this.index = this.data.index;
		this.title = this.data.title;
		this.stationsService.getStationByIndex(this.index).then(
			result => this._station = result
		);
    }
	
    ngOnDestroy(): void {
		this._station = undefined;
	}
}

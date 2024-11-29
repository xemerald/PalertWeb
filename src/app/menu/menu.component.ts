import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AreaService } from '../services/area.service';
import { FloorService } from '../services/floor.service';
import { FocusMapService } from '../services/map.service';
import { FocusMarkerService } from '../services/marker.service';
import { StationSearchService } from '../services/station-search.service';
import { StationsService } from '../services/stations.service';
import { StatusService } from '../services/status.service';
import { ShakeService } from '../services/shake.service';
import { ModalCtrlService } from '../modal/modal-ctrl.service';
import { PositionService } from '../services/position.service';

import { Station } from '../station';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
	public stations!: Observable<Station[]>;
	public menuSwitch: boolean = false;
	public menuPage: number = 0;
	public shakeIndex: number = -1;
	public filterSwitch: boolean[] = [false, false, false];

	private searchTerms = new Subject<string>();

	constructor(
		private stationsService: StationsService,
		private stationSearchService: StationSearchService,
		private mapService: FocusMapService,
		private markerService: FocusMarkerService,
		public areaService: AreaService,
		public floorService: FloorService,
		public statusService: StatusService,
		public shakeService: ShakeService,
		private modalCtrlService: ModalCtrlService,
		public positionService: PositionService
	) { }

/**
 *
 */
	ngOnInit(): void {
		this.stations = this.searchTerms.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			switchMap((term: string) => this.stationSearchService.search(term)),
		)
	}

/**
 *
 * @param term
 */
	search(term: string): void {
		this.searchTerms.next(term);
	}

/**
 *
 * @param station
 */
	selectStation(station: string): void {
		this.searchTerms.next('');
		let position = this.markerService.pickMarker(
			this.mapService.getNativeMap(),
			this.stationsService.getIndexByStationCode(station)
		);
		this.mapService.panMapTo(position, 15);
	}

/**
 *
 * @param station
 * @returns
 */
	selectStationMarker(station: string): string {
		if (this.menuPage < 2) {
			return this.markerService.getMarkersIcon(this.stationsService.getIndexByStationCode(station));
		}
		else {
			return this.markerService.getMarkersIcon();
		}
	}

/* Filter function */
/**
 *
 * @param n
 */
	switchFilter(n: number): void {
		this.resetFilter(false);
		switch (n) {
		case 0: {
			this.areaService.getAllArea();
			break;
		}
		case 1: {
			this.floorService.getAllFloor();
			break;
		}
		case 2: {
			this.statusService.startConnection();
			break;
		}
		default: {
			break;
		}
		}
		this.filterSwitch[n] = true;
	}

/**
 *
 * @param toNormal
 */
	resetFilter(toNormal: boolean): void {
		if ( toNormal ) {
			this.markerService.setMarkersIcon();
			this.markerService.switchCluster(true);
		}
		else {
			this.markerService.switchCluster(false);
		}

		this.statusService.closeConnection();
		this.markerService.setMarkersVisbility(true);

		for (let i=0; i<this.filterSwitch.length; i++) {
			this.filterSwitch[i] = false;
		}
	}

/**
 *
 * @param area
 */
	switchArea(area: string): void {
		this.areaService.areaCheck(area);
	}

/**
 *
 * @param floor
 */
	switchFloor(floor: string): void {
		this.floorService.floorCheck(floor);
	}

/* Shakemap function */
/**
 *
 */
	startShake(): void {
		this.shakeService.startShakeMap();
		this.markerService.resetInfoWindow();
		this.markerService.bindShakeWindow(this.mapService.getNativeMap());
	}

/**
 *
 * @param n
 */
	switchShake(n: number): void {
		this.shakeService.startConnection(n);
	}

/**
 *
 */
	endShake(): void {
		this.markerService.resetInfoWindow();
		this.shakeService.endShakeMap();
	}

/* Download list */
/**
 *
 */
	openDownloadModal(): void {
		this.modalCtrlService.openModal();
	}
}

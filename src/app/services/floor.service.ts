import { Injectable } from '@angular/core';

import { StationsService } from './stations.service';
import { StationSearchService } from './station-search.service';
import { FocusMarkerService } from './marker.service';
import { FloorIcon } from '../icon';
import { FloorTag, FloorValue } from '../floor';
import { lastValueFrom } from 'rxjs';

export interface FloorInfo {
	value: string;
	tag: string;
	icon: typeof FloorIcon[0];
	count: number;
};

@Injectable({
	providedIn: 'root'
})
export class FloorService {
	readonly floorInfo: FloorInfo[] = [];

	constructor (
		private stationsService: StationsService,
		private stationSearchService: StationSearchService,
		private markerService: FocusMarkerService
	) {
		for (let floor in FloorValue) {
			let iFloorInfo: FloorInfo = {
				value: FloorValue[floor],
				tag: floor,
				icon: FloorIcon[floor],
				count: 0
			};
			this.floorInfo.push(iFloorInfo);
		}
	}

	getAllFloor() {
		for (let floor in FloorValue) {
			if (FloorValue[floor].match("allfloor")) {
				continue;
			}
			else {
				lastValueFrom(this.stationSearchService.searchFloor(FloorValue[floor]))
					.then(result => {
						let _floor = FloorTag[floor as keyof typeof FloorTag]
						this.floorInfo[_floor].count = result.total;
						result.station.forEach(station => {
							this.markerService.setMarkersIcon(
								this.stationsService.getIndexByStationCode(station),
								this.floorInfo[_floor].icon
							);
						});
					});
			}
		}
	}

	floorCheck(floor: string) {
		if (floor.match("allfloor")) {
			this.markerService.revertAllMarkersVisibility();
		} else {
			lastValueFrom(this.stationSearchService.searchFloor(floor))
				.then(result => {
					let visibility = result.station.every(station =>
						this.markerService.checkMarkersVisbility(this.stationsService.getIndexByStationCode(station))
					) ? false : true;
					result.station.forEach(station =>
						this.markerService.setMarkersVisbility(
							visibility,
							this.stationsService.getIndexByStationCode(station)
						)
					);
			});
		}
	}
}

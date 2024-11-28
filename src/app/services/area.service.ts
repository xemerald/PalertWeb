import { Injectable } from '@angular/core';

import { lastValueFrom } from 'rxjs';

import { FocusMarkerService } from './marker.service';
import { StationsService } from './stations.service';
import { StationSearchService } from './station-search.service';
import { AreaIcon } from '../icon';
import { AreaName, AreaNameCht } from '../area';

export interface AreaInfo {
	english: string;
	chinese: string;
	icon: typeof AreaIcon[0];
	count: number;
};

@Injectable({
	providedIn: 'root'
})
export class AreaService {
	readonly areaInfo: AreaInfo[] = [];

	constructor (
		private stationsService: StationsService,
		private stationSearchService: StationSearchService,
		private markerService: FocusMarkerService
	) {
		for (let area in AreaNameCht) {
			let _areaInfo: AreaInfo = {
				english: area,
				chinese: AreaNameCht[area],
				icon: AreaIcon[area],
				count: 0
			};
			this.areaInfo.push(_areaInfo);
		}
	}

	getAllArea() {
		for (let area in AreaNameCht) {
			let _area = AreaName[area as keyof typeof AreaName];
			if (area.match("allarea")) {
				continue;
			}
			else {
				lastValueFrom(this.stationSearchService.searchArea(area))
					.then(result => {
						this.areaInfo[_area].count = result.total;
						result.station.forEach(station => {
							this.markerService.setMarkersIcon(
								this.stationsService.getIndexByStationCode(station),
								this.areaInfo[_area].icon
							);
						});
					});
			}
		}
	}

	areaCheck(area: string) {
		if (area.match("allarea")) {
			this.markerService.revertAllMarkersVisibility();
		}
		else {
			lastValueFrom(this.stationSearchService.searchArea(area))
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

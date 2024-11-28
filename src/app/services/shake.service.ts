import { Injectable } from '@angular/core';

import { FocusMapService } from './map.service';
import { FocusMarkerService } from './marker.service';
import { StationsService } from './stations.service';
import { MapStylesName } from '../map-style';
import { NormalIcon, ShakeIcon } from '../icon';

@Injectable({
	providedIn: 'root'
})
export class ShakeService {
	private url: string;
	private protocol: string;
	private mapWebSocket!: WebSocket;
	private statusColor: string[] = ["", "", "", "", ""];

	public timestamp: Date = new Date(0);
	public timeWindow: number = 1;

	readonly shakeTypes: string[] = [
		"Peak ground acceleration",
		"Peak ground velocity",
		"CWA 2020 Intensity Scale",
		"Spectrum acceleration 0.3s",
		"Spectrum acceleration 1.0s"
	];
	readonly shakeIcons: Array<any> = ShakeIcon;

	constructor (
		private mapService: FocusMapService,
		private markerService: FocusMarkerService,
		private stationsService: StationsService
	) {
		// this.url = "ws://shake.p-alert.tw:9999";
		this.url = "ws://127.0.0.1:9999";
		this.protocol = "map-shake-protocol";
	}

	startShakeMap() {
		this.mapService.switchMapLayers(MapStylesName.ShakeStyle);
		this.markerService.setMarkersVisbility(true, );
		this.markerService.setMarkersIcon(undefined, ShakeIcon[0]);
		this.markerService.switchCluster(false);
	}

	endShakeMap() {
		this.closeConnection();
		this.mapService.switchMapLayers(MapStylesName.NormalStyle);
		this.markerService.setMarkersVisbility(true, );
		this.markerService.genStationMarkers(this.mapService.getNativeMap(), NormalIcon, false);
		this.markerService.switchCluster(true);
	}

	startConnection(valueType: number) {
		this.closeConnection();

		this.mapWebSocket = new WebSocket(this.url, this.protocol);
		this.mapWebSocket.binaryType = "arraybuffer";

		this.mapWebSocket.onopen = () => {
		/* */
			if ( this.timeWindow < 1 )
				this.timeWindow = 1;
			else if ( this.timeWindow > 300 )
				this.timeWindow = 300;
		/* */
			this.stationsService.getStationExchange().then( result => {
				result.tag = valueType.toString() + ":" + this.timeWindow.toString();
				this.mapWebSocket.send(JSON.stringify(result));
			});
			this.statusColor[valueType] = "#00cc00"
		}

		this.mapWebSocket.onerror = () => {
			this.mapWebSocket.close();
			this.statusColor[valueType] = "#ff0000"
		}

		this.mapWebSocket.onmessage = (event) => {
			if (event.data instanceof ArrayBuffer) {
				let datatime = new Float64Array(event.data, 0, 1);
				let levels   = new Int8Array(event.data, 8);
			/* */
				this.timestamp = new Date(datatime[0] * 1000.0);
			/* */
				for (let i = 0, len = levels.length; i < len; i++) {
					if ( levels[i] === 0 ) {
						this.markerService.setMarkersVisbility(false, i);
						this.markerService.setMarkersIcon(i, null);
					}
					else {
						this.markerService.setMarkersIcon(i, this.shakeIcons[levels[i]]);
						this.markerService.setMarkersVisbility(true, i);
					}
				}
			}
		}
	}

	closeConnection() {
		if (this.mapWebSocket instanceof WebSocket) {
			this.mapWebSocket.close();
		}
	/* */
		this.markerService.setMarkersVisbility(true, );
		this.markerService.setMarkersIcon(undefined, ShakeIcon[0]);
	/* */
		for (let i = 0, len = this.statusColor.length; i < len; i++) {
			this.statusColor[i] = "";
		}
	}

	getStatusColor(valueType: number): string {
		return this.statusColor[valueType];
	}
}

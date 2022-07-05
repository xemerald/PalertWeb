import { Injectable } from '@angular/core';

import { FocusMarkerService } from './marker.service';
import { StationsService } from './stations.service';
import { StatusIcon } from '../icon';

@Injectable({
    providedIn: 'root'
})
export class StatusService {
    private url!: string;
	private protocol!: string;
	private webSocket!: WebSocket;

	public maxInt: number = 0;
	public seqNumber: number = 0;
	public regularCount: number = 0;
	public totalCount: number = 1;
    readonly statusIcons: typeof StatusIcon = StatusIcon;

	constructor(
		private markerService: FocusMarkerService,
		private stationsService: StationsService
	) {
		this.url = "ws://shake.p-alert.tw:9999";
		this.protocol = "station-status-protocol";
		this.maxInt = Math.pow(2, 32) - 1; /* The maximum of 4 bytes unsigned integer */
	}

    startConnection() {
		this.closeConnection();

		this.webSocket = new WebSocket(this.url, this.protocol);
		this.webSocket.binaryType = "arraybuffer";

		this.webSocket.onopen = () => {
			this.stationsService.getStationExchange().then( result => {
				this.webSocket.send(JSON.stringify(result));
			});
			this.seqNumber = 0;
			this.markerService.setMarkersIcon(undefined, this.statusIcons['regular']);
			this.totalCount = this.markerService.setMarkersStatus(true, );
			this.regularCount = this.totalCount;
		}

		this.webSocket.onerror = () => {
			this.webSocket.close();
		}

		this.webSocket.onmessage = (event) => {
			if (event.data instanceof ArrayBuffer) {
				let status = new Uint32Array(event.data);

				if (status[0] === this.seqNumber) {
					for (let i = 1, len = status.length; i < len; i++) {
						if (this.markerService.checkMarkersStatus(status[i])) {
							this.markerService.setMarkersStatus(false, status[i]);
							this.markerService.setMarkersIcon(status[i], this.statusIcons['broken']);
							this.regularCount--;
						} 
                        else {
							this.markerService.setMarkersStatus(true, status[i]);
							this.markerService.setMarkersIcon(status[i], this.statusIcons['regular']);
							this.regularCount++;
						}
					}
					if (this.seqNumber === this.maxInt) this.seqNumber = 0;
					else this.seqNumber++;
				} else {
					this.webSocket.close();
					this.startConnection();
				}
			};
		}
	}

	closeConnection() {
		if (this.webSocket instanceof WebSocket) {
			this.webSocket.close();
		}
	}
}

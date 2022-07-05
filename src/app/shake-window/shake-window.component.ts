import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { InfoWindowComponent } from '../infowindow.factory';
import { StationsService } from '../services/stations.service'; 

export interface GroundMotion {
	valueType: string;
	value: number;
};

@Component({
    selector: 'app-shake-window',
    templateUrl: './shake-window.component.html',
    styleUrls: ['./shake-window.component.css']
})
export class ShakeWindowComponent implements OnInit, OnDestroy, InfoWindowComponent {
    @Input() data: any;

	readyFlag: boolean;
	statusColor: string = "#000000";
	index!: number;
	title!: string;

	public groundMotions: GroundMotion[] = [];

	private url: string;
	private protocol: string;
	private stationWebSocket!: WebSocket;

	constructor(
		private stationsService: StationsService
	) {
		this.url = "ws://shake.p-alert.tw:9999";
		this.protocol = "station-shake-protocol";

		this.groundMotions = [
			{ valueType: 'Acc', value: 0 },
			{ valueType: 'Vel', value: 0 },
			{ valueType: 'Dis', value: 0 },
			{ valueType: 'Sal', value: 0 },
			{ valueType: 'Sas', value: 0 },
		];

		this.readyFlag = false;
	}

	ngOnInit(): void {
		this.index = this.data.index;
		this.title = this.data.title;
		this.startConnection();
	}
    
    ngOnDestroy(): void {
		this.closeConnection();
		this.groundMotions = [];
	}

	startConnection() {
		this.closeConnection();
		this.stationWebSocket = new WebSocket(this.url, this.protocol);
		this.stationWebSocket.binaryType = "arraybuffer";

		this.stationWebSocket.onopen = () => {
			this.stationsService.getStationCodeByIndex(this.index).then(
				result => {
					this.stationWebSocket.send(result);
				}
			);
			this.statusColor = "#00cc00";
			this.readyFlag = false;
		};

		this.stationWebSocket.onerror = () => {
			this.stationWebSocket.close();
			this.statusColor = "#ff0000";
			this.readyFlag = false;
		};

		this.stationWebSocket.onmessage = (event) => {
			if (event.data instanceof ArrayBuffer) {
				if (!this.readyFlag) this.readyFlag = true;
				let value = new Float64Array(event.data);
				for (let i=0, len=this.groundMotions.length; i<len; i++) {
					this.groundMotions[i].value = value[i];
				}
			}
		};
	}

	closeConnection() {
		if (this.stationWebSocket instanceof WebSocket) {
			this.stationWebSocket.close();
		}
	}
}

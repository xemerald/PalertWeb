import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { InfoWindowComponent } from '../infowindow.factory';
import { StationsService } from '../services/stations.service';

export interface GroundMotion {
	valueType: string;
	value: number;
	unit: string;
	bgcolor: string;
};

@Component({
	selector: 'app-shake-window',
	templateUrl: './shake-window.component.html',
	styleUrls: ['./shake-window.component.css']
})
export class ShakeWindowComponent implements OnInit, OnDestroy, InfoWindowComponent {
	@Input() data: any;

	public readyFlag: boolean;
	public index!: number;
	public title!: string;

	public groundMotions: GroundMotion[] = [];
	public timestamp: Date = new Date(0);

	private url: string;
	private protocol: string;
	private stationWebSocket!: WebSocket;

	private readonly levelColors: string[] = [
		"#c0c0c0",
		"#30ffcf",
		"#8fff70",
		"#bfff40",
		"#efff10",
		"#ffaf00",
		"#ff5000",
		"#ff2000",
		"#df0000",
		"#000000",
	];

	constructor(
		private stationsService: StationsService
	) {
		this.url = "ws://shake.p-alert.tw:9999";
		this.protocol = "station-shake-protocol";
	/* */
		this.groundMotions = [
			{ valueType: 'Acc', value: 0, unit: 'gal' , bgcolor: this.levelColors[0] },
			{ valueType: 'Vel', value: 0, unit: 'cm/s', bgcolor: this.levelColors[0] },
			{ valueType: 'Dis', value: 0, unit: 'cm'  , bgcolor: this.levelColors[0] },
			{ valueType: 'Sas', value: 0, unit: 'gal' , bgcolor: this.levelColors[0] },
			{ valueType: 'Sal', value: 0, unit: 'gal' , bgcolor: this.levelColors[0] },
		];
	/* */
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
					result = result + ":" + this.groundMotions.length.toString() + ":" + "1";
					this.stationWebSocket.send(result);
				}
			);
			this.readyFlag = false;
		};

		this.stationWebSocket.onerror = () => {
			this.stationWebSocket.close();
			this.readyFlag = false;
		};

		this.stationWebSocket.onmessage = (event) => {
			if (event.data instanceof ArrayBuffer) {
			/* */
				this.readyFlag = true;
			/* */
				let value = new Float64Array(event.data, 0, this.groundMotions.length + 1);
				let level = new Uint8Array(event.data, (this.groundMotions.length + 1) * 8);
				this.timestamp = new Date(value[0] * 1000.0);
				for (let i = 0, len = this.groundMotions.length; i < len; i++) {
					this.groundMotions[i].value = value[i + 1];
					this.groundMotions[i].bgcolor = this.levelColors[level[i]];
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

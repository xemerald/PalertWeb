import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';

import { StationsService } from '../services/stations.service';
import { InfoWindowComponent } from '../infowindow.factory';

interface Utility {
	type: string;
	value: string;
	status: boolean;
};

@Component({
  selector: 'app-modbus-window',
  templateUrl: './modbus-window.component.html',
  styleUrls: ['./modbus-window.component.css']
})
export class ModbusWindowComponent implements OnInit, OnDestroy, InfoWindowComponent {
	@Input() data: any;

	index!: number;
	title!: string;
	inputs: number[] = [0, 0, 0, 0];
	utilities: Utility[] = [];
	editFlag: boolean[] = [false, false, false, false];
	reachFlag: boolean = false;

	private station!: string;
	private apiURL!: string;
    
    constructor(
		private http: HttpClient,
		private stationsService: StationsService
	) {
		this.apiURL = "/apis/modbus_func";
		this.utilities = [
			{ type: 'Modbus', value: 'Connecting to the P-Alert...', status: true },
		];
	}

    ngOnInit(): void {
        this.index = this.data.index;
		this.title = this.data.title;
		this.stationsService.getStationCodeByIndex(this.index).then( station => {
			this.station = station;
			this.loadUtility(this.station);
		});
    }
    
    ngOnDestroy(): void {
        this.utilities = []
    }
    
	loadUtility(station: string, timeout?: number): void {
		let url = this.apiURL + `/modbus_fetch.php?station=${station}&timeout=${timeout}`;
		lastValueFrom(this.http.get<Utility[]>(url)).then(
			result => {
				this.utilities = result;
				if ( this.utilities.length == 4 )
					this.reachFlag = true;
			}
		);
	}

	alertDemo(level: number): void {
		let url = this.apiURL + `/modbus_demo.php?station=${this.station}&level=${level}`;

		this.resetUtilityEdit();
		if ( confirm("Run the Demo?") ) {
			lastValueFrom(this.http.get<string>(url))
				.then(result => alert(result));
		}
		else {
			alert("Cancel the Demo!");
		}
	}

	resetUtilityEdit(): void {
		this.editFlag = [false, false, false, false];
	}

	switchUtilityEdit(index:number): void {
		let _value = this.utilities[index].value.split('.');

		this.resetUtilityEdit()
		this.editFlag[index] = true;
		for ( let i = 0; i < this.inputs.length; i++ ) {
			let _input = parseInt(_value[i]);
			this.inputs[i] = isNaN(_input) ? 0 : _input;
		}
	}

	writeUtility(index: number): void {
		let url = this.apiURL + `/modbus_write.php?station=${this.station}&type=${this.utilities[index].type}`;
		let hint = "Update the " + this.utilities[index].type + " of " + this.station;

		this.resetUtilityEdit();
		if ( this.utilities[index].type != "F/W" ) {
			let value = this.genIPv4String(this.inputs);
			url  += `&value=${value}`;
			hint += " with " + value;
			if ( value === this.utilities[index].value ) {
				alert("The value is the same as previous, just skip it!");
				return;
			}
		}

		if ( confirm(hint + "?") ) {
			lastValueFrom(this.http.get<string>(url))
				.then(result => {
					alert(result);
					this.loadUtility(this.station, 24);
				});

			this.reachFlag = false;
			this.utilities = [
				{ type: 'Modbus', value: 'Updating the P-Alert...', status: true },
			];
		}
	}

	genIPv4String(inputs: number[]): string {
		let result: string = "";

		for ( let i = 0; i < inputs.length; i++ ) {
			result += inputs[i].toString();
			if ( i >= 3 )
				break;
			else
				result += '.';
		}

		return result;
	}
}

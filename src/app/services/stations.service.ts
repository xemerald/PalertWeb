import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';

import { Station, StationExchange } from '../station';

@Injectable({
    providedIn: 'root'
})
export class StationsService {
    private url: string;
    private stations!: Promise<Station[]>;
    private stationsMap: Map<string, number>;
    private stationResolver!: (stations: Station[]) => void;

    constructor(private http: HttpClient) {
        this.url = '/apis/genstation_json.php';
        this.stations =
            new Promise<Station[]>((resolve: (value: Station[]) => void) => { this.stationResolver = resolve; });
        this.stationsMap = new Map();
    }

    initialize(): void {
        lastValueFrom(this.http.get<Station[]>(this.url)).then(
            res => this.stationResolver(res as Station[])
        );
        /* Do the stationsMap need to be Promise? */
        this.stations.then(stations => {
            for (let i = 0, len = stations.length; i < len; i++) {
                this.stationsMap.set(stations[i].station, i);
            }
        });
    }

    getStations(): Promise<Station[]> {
        return this.stations;
    }

    getStationExchange(): Promise<StationExchange> {
        return this.stations.then(stations => ({
            tag: "all",
            total: stations.length,
            station: Array.from(this.stationsMap.keys())
        }));
    }

    getStationByIndex(index: number): Promise<Station> {
        return this.stations.then(stations =>
            stations[index]
        );
    }

    getIndexByStationCode(station: string): number {
        let result: number | undefined = this.stationsMap.get(station);
        return result !== undefined ? result : -1;
    }

    getStationCodeByIndex(index: number): Promise<string> {
        return this.stations.then(stations =>
            stations[index].station
        );
    }
}

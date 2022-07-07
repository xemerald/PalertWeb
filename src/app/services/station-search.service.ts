import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { Station, StationExchange } from '../station';

@Injectable({
    providedIn: 'root'
})
export class StationSearchService {

    constructor(
        private http: HttpClient
    ) { }

    search(term: string): Observable<Station[]> {
        if (!term.trim()) {
            return of([]);
        }
        else {
            return this.http
                .get<Station[]>(`/apis/genstation_json.php?term=${term}`);
        }
    }

    searchArea(term: string): Observable<StationExchange> {
        if (!term.trim()) {
            return of({
                tag: '', total: 0, station: []
            });
        }
        else {
            return this.http
                .get<StationExchange>(`/apis/genjson_area.php?area=${term}`);
        }       
    }

    searchFloor(term: string): Observable<StationExchange> {
        if (!term.trim()) {
            return of({
                tag: '', total: 0, station: []
            });
        }
        else {
            return this.http
                .get<StationExchange>(`/apis/genjson_floor.php?floor=${term}`);
        }      
        
    }

}

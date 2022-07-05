import { TestBed } from '@angular/core/testing';

import { MapGoogleService } from './map-google.service';

describe('MapGoogleService', () => {
    let service: MapGoogleService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MapGoogleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

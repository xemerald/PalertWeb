import { TestBed } from '@angular/core/testing';

import { MarkerLeafletService } from './marker-leaflet.service';

describe('MarkerLeafletService', () => {
    let service: MarkerLeafletService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MarkerLeafletService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

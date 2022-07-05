import { TestBed } from '@angular/core/testing';

import { FocusMarkerService } from './marker.service';

describe('FocusMarkerService', () => {
    let service: FocusMarkerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FocusMarkerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

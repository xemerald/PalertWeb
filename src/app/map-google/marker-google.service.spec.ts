import { TestBed } from '@angular/core/testing';

import { MarkerGoogleService } from './marker-google.service';

describe('MarkerGoogleService', () => {
    let service: MarkerGoogleService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MarkerGoogleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

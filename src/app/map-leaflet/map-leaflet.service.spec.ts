import { TestBed } from '@angular/core/testing';

import { MapLeafletService } from './map-leaflet.service';

describe('MapLeafletService', () => {
  let service: MapLeafletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapLeafletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

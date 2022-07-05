import { TestBed } from '@angular/core/testing';

import { ShakeService } from './shake.service';

describe('ShakeService', () => {
  let service: ShakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

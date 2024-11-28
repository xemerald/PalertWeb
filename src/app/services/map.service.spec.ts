import { TestBed } from '@angular/core/testing';

import { FocusMapService } from './map.service';

describe('FocusMapService', () => {
	let service: FocusMapService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(FocusMapService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

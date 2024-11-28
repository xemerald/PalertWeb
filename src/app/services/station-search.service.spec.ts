import { TestBed } from '@angular/core/testing';

import { StationSearchService } from './station-search.service';

describe('StationSearchService', () => {
	let service: StationSearchService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(StationSearchService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

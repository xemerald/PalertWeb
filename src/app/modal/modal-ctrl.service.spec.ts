import { TestBed } from '@angular/core/testing';

import { ModalCtrlService } from './modal-ctrl.service';

describe('ModalCtrlService', () => {
	let service: ModalCtrlService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ModalCtrlService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

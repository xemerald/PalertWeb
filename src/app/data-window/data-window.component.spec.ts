import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataWindowComponent } from './data-window.component';

describe('DataWindowComponent', () => {
	let component: DataWindowComponent;
	let fixture: ComponentFixture<DataWindowComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ DataWindowComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(DataWindowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

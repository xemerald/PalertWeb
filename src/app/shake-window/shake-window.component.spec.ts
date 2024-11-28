import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShakeWindowComponent } from './shake-window.component';

describe('ShakeWindowComponent', () => {
	let component: ShakeWindowComponent;
	let fixture: ComponentFixture<ShakeWindowComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ShakeWindowComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ShakeWindowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

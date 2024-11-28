import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModbusWindowComponent } from './modbus-window.component';

describe('ModbusWindowComponent', () => {
	let component: ModbusWindowComponent;
	let fixture: ComponentFixture<ModbusWindowComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ModbusWindowComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(ModbusWindowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

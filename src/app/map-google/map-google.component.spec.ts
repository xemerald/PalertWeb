import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGoogleComponent } from './map-google.component';

describe('MapGoogleComponent', () => {
    let component: MapGoogleComponent;
    let fixture: ComponentFixture<MapGoogleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MapGoogleComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(MapGoogleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

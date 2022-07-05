import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps'

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { ModalComponent } from './modal/modal.component';
import { MapLeafletComponent } from './map-leaflet/map-leaflet.component';
import { MapGoogleComponent } from './map-google/map-google.component';
import { DataWindowComponent } from './data-window/data-window.component';
import { ModbusWindowComponent } from './modbus-window/modbus-window.component';
import { ShakeWindowComponent } from './shake-window/shake-window.component';

@NgModule({
    declarations: [
        AppComponent,
        MenuComponent,
        ModalComponent,
        MapLeafletComponent,
        MapGoogleComponent,
        DataWindowComponent,
        ModbusWindowComponent,
        ShakeWindowComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        GoogleMapsModule
    ],
    exports: [
        MapGoogleComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

import { Injectable, ComponentRef, Type, ViewContainerRef } from '@angular/core';

export class InfoWindowItem {
	constructor(public component: Type<any>, public data: any) {}
}

export interface InfoWindowComponent {
	data: any;
}

@Injectable({
    providedIn: 'root'
})
export class InfoWindowFactory {
  	private compRef?: ComponentRef<InfoWindowComponent>;

	constructor ( ) { }

	createWindow(infoWindowItem: InfoWindowItem, viewContainerRef: ViewContainerRef): HTMLElement {
		let div = document.createElement('div');

        if (this.compRef) this.compRef.destroy();

        this.compRef = viewContainerRef.createComponent(infoWindowItem.component);
        this.compRef.instance.data = infoWindowItem.data;
        this.compRef.onDestroy(() => {
            viewContainerRef.clear();
        });

        div.appendChild(this.compRef.location.nativeElement);

		return div;
	}

	destroyWindow(): void {
		if (this.compRef) this.compRef.destroy();
	}
}

import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ModalCtrlService {
	modalCtrl = new Subject<boolean>();

	openModal(): void {
		this.modalCtrl.next(true);
	}

	closeModal(): void {
		this.modalCtrl.next(false);
	}
}

import { Component, OnInit } from '@angular/core';
import { ModalCtrlService } from './modal-ctrl.service'

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
	modalSwitch: boolean;

	constructor(
		private modalCtrlService: ModalCtrlService
	) {
		this.modalSwitch = false;
		this.modalCtrlService.modalCtrl.subscribe(
			value => this.modalSwitch = value
		);
	}

	ngOnInit(): void {
		let window = document.defaultView;
		if (window) {
			window.addEventListener("click", event => {
				let modal = document.getElementById('whole-modal');
				if ( event.target == modal ) {
					this.closeModal();
				}
			});
		}
	}

	openModal(): void {
		this.modalSwitch = true;
	}

	closeModal(): void {
		this.modalSwitch = false;
	}
}

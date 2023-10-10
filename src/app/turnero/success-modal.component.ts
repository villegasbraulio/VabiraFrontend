import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-success-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{ message }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="activeModal.close('Aceptar')">Aceptar</button>
    </div>
  `
})
export class SuccessModalComponent {
  @Input() title: string = 'Éxito';
  @Input() message: string = 'Operación completada con éxito';

  constructor(public activeModal: NgbActiveModal) {}
}

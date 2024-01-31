import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-second-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirmación de Seña</h4>
      <button type="button" class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{ data }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Cerrar</button>
    </div>
  `,
})
export class SecondModalComponent {
  @Input() data: string = '';

  closeModal(): void {
    // Puedes realizar acciones adicionales antes de cerrar el modal si es necesario
    this.modalService.dismissAll();
    
    // Recarga la página actual
    window.location.reload();
  }

  constructor(private modalService: NgbModal, private location: Location) {}
}

import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mercado-pago-modal',
  templateUrl: './mercadopagomodal.component.html',
  styleUrls: ['./mercadopagomodal.component.css'],
})
export class MercadoPagoModalComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  closeModal(): void {
    this.modalService.dismissAll();
  }
}

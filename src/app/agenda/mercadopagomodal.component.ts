import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MercadoPagoService } from './mercadopagomodal.service';
import { UserService } from '../users/users.service';
import { AgendaService } from './agenda.service';
import { SecondModalComponent } from './secondmodal.component';

@Component({
  selector: 'app-mercado-pago-modal',
  templateUrl: './mercadopagomodal.component.html',
  styleUrls: ['./mercadopagomodal.component.css'],
})
export class MercadoPagoModalComponent implements OnInit {
  clientId: any;
  constructor(private modalService: NgbModal, private mercadoPagoService: MercadoPagoService, private userService: UserService,
    private agendaService: AgendaService) {}

  ngOnInit(): void {
    this.userService.obtenerPerfilCliente().subscribe(
      (data: any) => {
        this.clientId = data;
      },
      (error) => {
        console.error('Error al obtener los datos del cliente:', error);
      }
    );
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  closeModal2(): void {
    // Obtiene el ID del turno seleccionado desde el servicio AgendaService
    const idTurnoSeleccionado = this.agendaService.obtenerIdTurnoSeleccionado();
    console.log('idTurnoSeleccionado: ',idTurnoSeleccionado);
    console.log('this.clientId: ', this.clientId.id);
    

    // Lógica para manejar el cambio de estado del turno a "Espera de Seña"
    this.agendaService.agendarTurnoDeSeña(idTurnoSeleccionado, this.clientId.id).subscribe(
      (response) => {
        console.log('Turno actualizado exitosamente:', response);
        // Muestra el segundo modal
        this.mostrarSegundoModal();
      },
      (error) => {
        console.error('Error al actualizar el estado del turno:', error);
        this.modalService.dismissAll();
      }
    );
  }

  // Método para mostrar el segundo modal
  mostrarSegundoModal(): void {
    const modalRef = this.modalService.open(SecondModalComponent, { centered: true });
    modalRef.componentInstance.data = 'Espere la confirmación de su seña por favor.';
  }
}

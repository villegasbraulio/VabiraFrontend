import { Component, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { NotificacionesService } from './notificaciones.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
  providers: [MessageService]
})
export class NotificacionesComponent implements OnInit {
  messages: Message[] = [];

  constructor(private notificacionesService: NotificacionesService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.notificacionesService.nuevoTurno$.subscribe((turno: any) => {
      console.log('Nuevo turno recibido en NotificacionesComponent:', turno);
      if (turno && turno.supplierId) {
        this.messages = [];
        this.messages.push({ severity: 'success', summary: 'Nuevo Turno', detail: `¡Nuevo turno asignado con Supplier ID: ${turno.supplierId}` });
        this.messageService.addAll(this.messages);
      }
    });
    
  }
}

import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from './notificaciones.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UserService } from '../users/users.service';
import { ClienteService } from '../cliente/cliente.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  alerts: any[] = [];
  userClientId: number = 9; // Esto asegura que userClientId sea de tipo number
  cliente: any; // Ajusta el tipo de esta variable según la estructura de tu cliente


  constructor(private notificacionesService: NotificacionesService, 
    private datePipe: DatePipe, 
    private messageService: MessageService, 
    private userService:UserService,
    private clienteService: ClienteService) { }

  ngOnInit(): void {

    this.userService.obtenerPerfil().subscribe(profile => {// aca me devuelve id del usuario activo
      this.userClientId = profile.id;
      console.log(this.userClientId)

      this.clienteService.obtenerCliente(this.userClientId).subscribe(// aca tendria que buscar el cliente con id de la alerta 
        (cliente: any) => {
          this.cliente = cliente;
          console.log(this.cliente)
        }
      );

    this.notificacionesService.getAlerts().subscribe(alerts => {
      // Filtra las alertas para encontrar aquellas que corresponden al usuario logueado
      console.log(alerts)
      this.alerts = alerts.filter(alert => alert.turn.clientId === this.userClientId);

      // Verifica si el usuario tiene un turno próximo y muestra un mensaje en consecuencia
      const tieneTurnoProximo = this.alerts.some(alert => this.esTurnoProximo(alert));
      if (tieneTurnoProximo) {
        console.log('Tienes un turno próximo.');
        // Aquí puedes mostrar un mensaje utilizando PrimeNG MessageService
      } else {
        console.log('No tienes un turno próximo.');
        // Aquí puedes mostrar un mensaje indicando que el usuario no tiene un turno próximo.
      }
    });
    
  }
)
}


 
esTurnoProximo(alert: any): boolean {
  // Obtiene la fecha actual
  const now = new Date();

  // Obtiene la fecha del turno y la convierte a un objeto Date
  const fechaTurno = new Date(alert.turn.dateFrom);

  // Calcula la diferencia en milisegundos entre la fecha del turno y la fecha actual
  const diferenciaMilisegundos = fechaTurno.getTime() - now.getTime();

  // Convierte la diferencia de milisegundos a horas
  const diferenciaHoras = diferenciaMilisegundos / (1000 * 3600);

  // Verifica si la diferencia de horas es menor que 48
 
  if (diferenciaHoras < 48) {

    console.log('`Tienes un turno próximo el')
    // Muestra un mensaje de notificación utilizando PrimeNG MessageService
    this.messageService.add({
      severity: 'info',
      summary: 'Turno Próximo',
      detail: `Tienes un turno próximo el  'dd/MM/yyyy HH:mm')}.`
    });

    return true;
  }

  return false;
}
}

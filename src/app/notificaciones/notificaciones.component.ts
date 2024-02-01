import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from './notificaciones.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UserService } from '../users/users.service';
import { ClienteService } from '../cliente/cliente.service';
import { ProveedorService } from '../proveedor/proveedor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  alerts: any[] = [];
  userClientId: number = 0; // Esto asegura que userClientId sea de tipo number
  cliente: any; // Ajusta el tipo de esta variable según la estructura de tu cliente
  supplier: any;
  clienteIdFound: any;
  supplierIdFound: any;
  fecha: any;
  messageAlerts: any[] = [];


  constructor(private notificacionesService: NotificacionesService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.userService.obtenerPerfil().subscribe(profile => {
      this.userClientId = profile.id;

      if (profile.roles.includes('client')) {
        this.userService.obtenerPerfilCliente().subscribe(
          (data: any) => {
            this.clienteIdFound = data.id;
            this.realizarLlamadasAPIClient();
          },
          (error) => {
            console.error('Error al obtener los datos del cliente:', error);
          }
        );
      }

      if (profile.roles.includes('supplier')) {
        this.userService.obtenerPerfilSupplier().subscribe(
          (data: any) => {
            this.supplierIdFound = data.id;
            this.realizarLlamadasAPISupplier();
          },
          (error) => {
            console.error('Error al obtener los datos del proveedor:', error);
          }
        );
      }
    });
  }

  realizarLlamadasAPIClient() {

    this.notificacionesService.getAlertsClient(this.clienteIdFound).subscribe(alerts => {
      for (const alert of alerts) {

        // Verificar si el cliente de la alerta coincide con el cliente del usuario
        if (alert.turn.client.id === this.clienteIdFound) {
          this.messageAlerts.push({
            message: `Tienes un turno próximo el ${this.datePipe.transform(alert.turn.dateFrom, 'dd/MM/yyyy HH:mm')}.`
          })
        }
      }
    });

  }

  realizarLlamadasAPISupplier() {

    this.notificacionesService.getAlertsSupplier(this.supplierIdFound).subscribe(alerts => {
      this.alerts = alerts
      for (const alert of alerts) {
        if(!alert.turn.schedule.hasSign){
          this.messageAlerts.push({
            message: `Tienes un turno próximo el ${this.datePipe.transform(alert.turn.dateFrom, 'dd/MM/yyyy HH:mm')}, en la agenda ${alert.turn.schedule.name}.
            Con el/la cliente ${alert.turn.client?.user.lastName}, ${alert.turn.client?.user.firstName}`,
            flag:false
          })
        } else {
          
          this.messageAlerts.push({
          message: `Tienes un turno próximo el ${this.datePipe.transform(alert.turn.dateFrom, 'dd/MM/yyyy HH:mm')}
           Con el/la cliente ${alert.turn.client?.user.lastName}, ${alert.turn.client?.user.firstName}`,
          flag:true,
          id:alert.turn.schedule.id
          })
        }
        
      }
    });
  }

  navigateToDetalleTurno(scheduleId: number) {
    this.router.navigate(['/agenda', scheduleId]); // Ajusta la ruta y parámetros según tu configuración
  }

}

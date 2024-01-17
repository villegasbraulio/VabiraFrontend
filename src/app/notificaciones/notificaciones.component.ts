import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from './notificaciones.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UserService } from '../users/users.service';
import { ClienteService } from '../cliente/cliente.service';
import { ProveedorService } from '../proveedor/proveedor.service';

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


  constructor(private notificacionesService: NotificacionesService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private userService: UserService,
    private clienteService: ClienteService,
    private proveedorService: ProveedorService) { }

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
          for (const alert of alerts) {
            // Verificar si el cliente de la alerta coincide con el cliente del usuario
            if (alert.turn.client.id === this.clienteIdFound) {
              console.log('ID del cliente de la alerta:', alert.turn.client.id);
              console.log('ID de la alerta:', alert.id);
              console.log('Nombre de la alerta:', alert.name);
              console.log('Descripción de la alerta:', alert.description);
              console.log('Fecha de inicio del turno:', alert.turn.dateFrom);
              console.log('Fecha de fin del turno:', alert.turn.dateTo);

              const mensaje = `Tienes un turno próximo el ${this.datePipe.transform(alert.turn.dateFrom, 'dd/MM/yyyy HH:mm')}.`;

              // Agregar mensaje utilizando el servicio MessageService de PrimeNG
              this.messageService.add({
                severity: 'info',
                summary: 'Turno Próximo',
                detail: mensaje
              });
            }
          }
        }
      }
    });

  }

  realizarLlamadasAPISupplier() {

    this.notificacionesService.getAlertsSupplier(this.supplierIdFound).subscribe(alerts => {
      for (const alert of alerts) {
        console.log('alertas: ', alerts);
        
        // Verificar si el cliente de la alerta coincide con el proveedor del usuario
        if (alert.turn.schedule.supplier.id === this.supplierIdFound) {
          for (const alert of alerts) {
            console.log('alertas2: ', alerts);
            // Verificar si el cliente de la alerta coincide con el cliente del usuario
            if (alert.turn.schedule.supplier.id === this.supplierIdFound) {
              console.log('ID del cliente de la alerta:', alert.turn.client.id);
              console.log('ID de la alerta:', alert.id);
              console.log('Nombre de la alerta:', alert.name);
              console.log('Descripción de la alerta:', alert.description);
              console.log('Fecha de inicio del turno:', alert.turn.dateFrom);
              console.log('Fecha de fin del turno:', alert.turn.dateTo);

              // ... Mostrar otras propiedades según la estructura de tu objeto alerta ...
              const nombreAgenda = alert.turn.schedule.name;

              const mensaje = `Tienes un turno próximo el ${this.datePipe.transform(alert.turn.dateFrom, 'dd/MM/yyyy HH:mm')}, en la agenda ${nombreAgenda}`;

              // Agregar mensaje utilizando el servicio MessageService de PrimeNG
              this.messageService.add({
                severity: 'info',
                summary: 'Turno Próximo',
                detail: mensaje
              });
            }
          }
        }
      }
    });
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

    // if (diferenciaHoras < 48) {

    console.log('`Tienes un turno próximo el')
    // Muestra un mensaje de notificación utilizando PrimeNG MessageService
    this.messageService.add({
      severity: 'info',
      summary: 'Turno Próximo',
      detail: `Tienes un turno próximo el  'dd/MM/yyyy HH:mm')}.`
    });

    return true;
    // }
  }
}

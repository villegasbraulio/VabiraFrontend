import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
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
  @Input() visible: boolean = true;
  @Input() showButton: boolean = false;
  @Input() customMessage: string = '';
  @Output() buttonClick = new EventEmitter<void>();

  alerts: any[] = [];
  userClientId: number = 0; // Esto asegura que userClientId sea de tipo number
  cliente: any; // Ajusta el tipo de esta variable según la estructura de tu cliente
  supplier: any;
  clienteIdFound: any;
  supplierIdFound: any;
  showCustomButton: boolean = false;
  customMessageContent: string = '';
  currentTurno: any;
  fecha: any;


  constructor(private notificacionesService: NotificacionesService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private userService: UserService,) { }

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
            message: `Tienes un turno próximo el ${this.datePipe.transform(alert.turn.dateFrom, 'dd/MM/yyyy HH:mm')}.
            Con ${alert.turn.schedule?.supplier?.user.lastName}, ${alert.turn.schedule?.supplier?.user.firstName}`
          })
        }
      }
    });
  }
  realizarLlamadasAPISupplier() {

    this.notificacionesService.getAlertsSupplier(this.supplierIdFound).subscribe(alerts => {

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
          id:alert.turn.schedule.id,
          idTurn:alert.turn.turnStatus[0].turnStatusType.code
          })
        }
      }
    });
  }

  aprobarSena(turno: any) {
    // Lógica para aprobar la seña
    // ...
    console.log('Seña aprobada para el turno:', turno.id);
    this.hideCustomMessage();
  }

  onButtonClick() {
    this.buttonClick.emit();
  }

  onButtonClickClose() {
    this.visible = false;
  }

  private showCustomMessage(content: string, turno: any) {
    this.customMessageContent = content;
    this.showCustomButton = true;
    this.currentTurno = turno;
  }

  private hideCustomMessage() {
    this.showCustomButton = false;
    this.customMessageContent = '';
  }

}

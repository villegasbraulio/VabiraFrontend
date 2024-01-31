import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { AgendaService } from './agenda.service';
import { UserService } from '../users/users.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MercadoPagoModalComponent } from './mercadopagomodal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class AgendaComponent implements OnInit {
  @ViewChild('dt1') dataTable: Table | null = null;
  private mercadoPagoModalRef: NgbModalRef | undefined;
  turns: any[];
  columnas: any[] = [];
  usuario: any;
  profileTypes: any[] = [];
  turns2: any[];
  columnas2: any[] = [];
  days: { name: string; monthDay: string }[] = [];
  days2: string[] = [];
  currentDate = moment();
  scheduleData: any;
  timeSlots: { start: string; end: string }[] = [];
  reservedTimeSlots: Set<string> = new Set<string>();
  availableTimeSlots: Set<string> = new Set<string>();
  aproveTimeSlots: Set<string> = new Set<string>();
  desaproveTimeSlots: Set<string> = new Set<string>();
  reservedWtSignTimeSlots: Set<string> = new Set<string>();
  clientId: any;
  agendaId: any;
  alias: string = '';
  initialAmount: number = 0;
  messages: Message[] = [];
  buttonStates: { [buttonId: string]: string } = {}; // Nuevo objeto para rastrear el estado de los botones

  constructor(private dialog: MatDialog, private messageService: MessageService,
    private agendaService: AgendaService, private userService: UserService,
    private activatedRoute: ActivatedRoute, private confirmationService: ConfirmationService,
    private modalService: NgbModal) {

    this.turns = [];

    this.turns2 = [];

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.agendaId = +params['id'];
      this.userService.obtenerPerfilCliente().subscribe(
        (data: any) => {
          this.clientId = data;
        },
        (error) => {
          console.error('Error al obtener los datos del cliente:', error);
        }
      );

      this.agendaService.obtenerAgenda(this.agendaId).subscribe((data) => {
        this.scheduleData = data;
        this.alias = this.scheduleData.alias
        this.initialAmount = this.scheduleData.turn[0]?.sign.initialAmount
        if (this.scheduleData && this.scheduleData.turn) {
          this.days = this.scheduleData.turn
            .reduce((uniqueDays: string[], turn: any) => {
              const combinedDay = `${turn.classDayType.name} ${turn.monthDay}`;
              if (!uniqueDays.includes(combinedDay)) {
                uniqueDays.push(combinedDay);
              }
              return uniqueDays;
            }, []);
          this.days2 = this.scheduleData.turn
            .reduce((uniqueDays2: string[], turn: any) => {
              if (!uniqueDays2.includes(turn.classDayType.name)) {
                uniqueDays2.push(turn.classDayType.name);
              }
              return uniqueDays2;
            }, []);
        }

        setInterval(() => {
          this.updateCurrentDate2();
        }, 1000);

        this.generateTimeSlots();
        this.loadReservedAndAvailableTurns();
        this.loadAllTurns();
        this.updateButtonStates();
        this.cargarTurnos();
        this.cargarTurnos2();
      });
    });

    this.userService.obtenerPerfil().subscribe(
      (data: any) => {
        this.usuario = data;
        const p: string[] = [];
        const roles = this.usuario.roles.split(',');
        if (this.usuario?.roles) {
          for (const role of roles) {
            p.push(role);
          }
        }
        this.profileTypes = p;

        if (this.profileTypes.includes('supplier')) {
          this.columnas2 = [
            { field: 'currentDate', header: 'Fecha y Hora Actual' },
            { field: 'turn2.totalTurns', header: 'Turnos de la agenda' },
            { field: 'turn2.reservedTurns', header: 'Turnos Reservados' },
            { field: 'turn2.availableTurns', header: 'Turnos Disponibles' },
            { field: 'proximoCliente', header: 'Proximo cliente' },
            { field: 'turn2.aproveTurns', header: 'Turnos Presentes' },
            { field: 'turn2.desaproveTurns', header: 'Turnos Ausentes' },
          ];
        } else {
          this.columnas2 = [
            { field: 'currentDate', header: 'Fecha y Hora Actual' },
            { field: 'turn2.totalTurns', header: 'Turnos de la agenda' },
            { field: 'turn2.reservedTurns', header: 'Turnos Reservados' },
            { field: 'turn2.availableTurns', header: 'Turnos Disponibles' },
          ];
        }
        if (this.profileTypes.includes('client')) {
          this.columnas = [
            { field: 'turn.dateFrom', header: 'Hora' },
            { field: 'turn?.client.user.firstName', header: 'Nombre' },
            { field: 'turn.turnStatus.turnStatusType.name', header: 'Estado' },
          ];
        } else {
          this.columnas = [
            { field: 'turn.dateFrom', header: 'Hora' },
            { field: 'turn?.client.user.firstName', header: 'Nombre' },
            { field: 'turn.turnStatus.turnStatusType.name', header: 'Estado' },
            { field: 'acciones', header: 'Acciones' },
          ];
        }
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );


  }

  handleTurnClick(turnoId: number): void {
    console.log('turnoid: ', turnoId);
    
    turnoId = this.turns[0]?.id;
    this.agendaService.guardarIdTurnoSeleccionado(turnoId);
  }
  

  updateCurrentDate2() {
    this.currentDate = moment();
  }

  cargarTurnos() {
    this.agendaService.obtenerTurnosPorAgenda(this.agendaId).subscribe((data: any) => {
      this.turns = data.map((turn: any) => {
        return {
          ...turn,
          dateFormatted: this.formatDate(turn.dateFrom),
        };
      });

      this.turns.sort((a, b) => moment(a.dateFrom).diff(moment(b.dateFrom)));
      if (this.dataTable) {
        this.dataTable.reset();
      }
    });
  }

  cargarTurnos2() {
    this.agendaService.obtenerTurnosLlenarTabla(this.agendaId).subscribe((data: any) => {
      if (data) {
        if (data.totalTurns !== undefined && data.reservedTurns !== undefined && data.availableTurns !== undefined) {
          this.turns2 = [{
            totalTurns: data.totalTurns,
            reservedTurns: data.reservedTurns,
            availableTurns: data.availableTurns,
            aproveTurns: data.aproveTurns,
            desaproveTurns: data.desaproveTurns
          }];

          let proximoCliente = '';
          if (Array.isArray(data.reservedTurns2) && data.reservedTurns2.length > 0) {
            let minDiff = Number.MAX_VALUE;
            for (const reservedTurn of data.reservedTurns2) {
              if (reservedTurn.dateFrom) {
                const turnoMoment = moment(reservedTurn.dateFrom);
                const diff = turnoMoment.diff(this.currentDate);
                if (diff > 0 && diff < minDiff) {
                  minDiff = diff;
                  const nombre = reservedTurn.client?.user?.firstName || '';
                  const apellido = reservedTurn.client?.user?.lastName || '';
                  proximoCliente = `${nombre} ${apellido}`;
                }
              }
            }
          }
          this.turns2[0].proximoCliente = proximoCliente;
          console.log(this.turns2);
          console.log(this.turns2[0].proximoCliente);

        } else {
          console.error('Estructura de datos inesperada:', data);
        }
      }
    });
  }

  formatDate(date: string): string {
    moment.locale('es');
    const formattedDate = moment(date).format('HH:mm dddd DD-MM');
    const words = formattedDate.split(' ');
    if (words.length > 1) {
      words[1] = words[1].charAt(0).toUpperCase() + words[1].slice(1);
    }
    return words.join(' ');
  }

  handleTimeClick(dayType: any, start: string, end: string) {
    const selectedTurn = this.scheduleData.turn.find((turn: any) => {
      const turnStartTime = moment(turn.dateFrom).format('hh:mm A');
      const turnEndTime = moment(turn.dateTo).format('hh:mm A');

      const isSameDayType = turn.classDayType.name === dayType;
      const isAfterOrEqualStart = moment(start, 'hh:mm A').isSameOrAfter(moment(turnStartTime, 'hh:mm A'));
      const isBeforeOrEqualEnd = moment(end, 'hh:mm A').isSameOrBefore(moment(turnEndTime, 'hh:mm A'));

      return isSameDayType && isAfterOrEqualStart && isBeforeOrEqualEnd;
    });

    if (!selectedTurn) {
      console.log('No se encontró un turno que coincida.');
      return;
    }

    const id = selectedTurn.id;
    const clienteId = this.clientId;
    const toUpdate = {
      client: clienteId,
      classDayType: selectedTurn.classDayType,
      startTime: start,
      endTime: end
    };

    if (this.reservedTimeSlots.has(`${dayType}-${start}-${end}`)) {
      this.agendaService.cancelarTurno(id, toUpdate).subscribe((data: any) => {
        this.availableTimeSlots.add(`${dayType}-${start}-${end}`);
        this.messages = [{ severity: 'success', summary: 'Éxito', detail: 'Turno cancelado con éxito' }];
        this.buttonStates[this.getButtonId(dayType, start, end)] = 'Reservar';
        this.cargarTurnos(); // Agregar para actualizar las tablas
        this.cargarTurnos2(); // Agregar para actualizar las tablas
        this.loadReservedAndAvailableTurns();
      });
    } else if (this.availableTimeSlots.has(`${dayType}-${start}-${end}`)) {
      this.agendaService.agendarTurno(id, toUpdate).subscribe((data: any) => {
        this.reservedTimeSlots.add(`${dayType}-${start}-${end}`);
        this.messages = [{ severity: 'success', summary: 'Éxito', detail: 'Turno reservado con éxito' }];
        this.buttonStates[this.getButtonId(dayType, start, end)] = 'Reservado';
        this.cargarTurnos(); // Agregar para actualizar las tablas
        this.cargarTurnos2(); // Agregar para actualizar las tablas
        this.loadReservedAndAvailableTurns();
        },
        (error) => {
          if (!this.profileTypes.includes('supplier')){
            this.mercadoPagoModalRef = this.modalService.open(MercadoPagoModalComponent, {size: 'lg'});
            this.mercadoPagoModalRef.componentInstance.selectedTurnId = selectedTurn.id;
            this.mercadoPagoModalRef.componentInstance.mercadoPagoLink = 'https://www.mercadopago.com/';
            this.reservedTimeSlots.add(`${dayType}-${start}-${end}`);
            // this.messages = [{ severity: 'success', summary: 'Éxito', detail: 'Turno reservado sin seña con éxito' }];
            this.buttonStates[this.getButtonId(dayType, start, end)] = 'Reservado s/aprobar';
            this.cargarTurnos(); // Agregar para actualizar las tablas
            this.cargarTurnos2(); // Agregar para actualizar las tablas
            this.loadReservedAndAvailableTurns();
          }
        }
      );
    } else if (this.desaproveTimeSlots.has(`${dayType}-${start}-${end}`)) {
      this.agendaService.aprobarTurno(id).subscribe((data: any) => {
        this.aproveTimeSlots.add(`${dayType}-${start}-${end}`);
        this.messages = [{ severity: 'success', summary: 'Éxito', detail: 'Turno registrado como presente con éxito' }];
        this.buttonStates[this.getButtonId(dayType, start, end)] = 'Presente';
        this.cargarTurnos(); // Agregar para actualizar las tablas
        this.cargarTurnos2(); // Agregar para actualizar las tablas
        this.loadReservedAndAvailableTurns();
      });
    } else {
      this.agendaService.desaprobarTurno(id).subscribe((data: any) => {
        this.desaproveTimeSlots.add(`${dayType}-${start}-${end}`);
        this.messages = [{ severity: 'success', summary: 'Éxito', detail: 'Turno registrado como ausente con éxito' }];
        this.buttonStates[this.getButtonId(dayType, start, end)] = 'Ausente';
        this.cargarTurnos(); // Agregar para actualizar las tablas
        this.cargarTurnos2(); // Agregar para actualizar las tablas
        this.loadReservedAndAvailableTurns();
      });
    } 
  }

  loadReservedAndAvailableTurns() {
    this.agendaService.obtenerTurnosReservadosPorAgenda(this.agendaId).subscribe((reservedTurns) => {
      this.reservedTimeSlots = new Set<string>();
      reservedTurns.forEach((reservedTurn) => {
        if (reservedTurn.classDayType && reservedTurn.dateFrom && reservedTurn.dateTo) {
          const buttonId = this.getButtonId(reservedTurn.classDayType.name, reservedTurn.dateFrom, reservedTurn.dateTo);
          this.reservedTimeSlots.add(buttonId);
        }
      });
      this.updateButtonStates();
    });

    this.agendaService.obtenerTurnosDisponiblesPorAgenda(this.agendaId).subscribe((availableTurns) => {
      this.availableTimeSlots = new Set<string>();
      availableTurns.forEach((availableTurn) => {
        if (availableTurn.classDayType && availableTurn.dateFrom && availableTurn.dateTo) {
          const buttonId = this.getButtonId(availableTurn.classDayType.name, availableTurn.dateFrom, availableTurn.dateTo);
          this.availableTimeSlots.add(buttonId);
        }
      });
      this.updateButtonStates();
    });

    this.agendaService.obtenerTurnosDesaprobadosPorAgenda(this.agendaId).subscribe((desaproveTurns) => {
      this.desaproveTimeSlots = new Set<string>();
      desaproveTurns.forEach((desaproveTurn) => {
        if (desaproveTurn.classDayType && desaproveTurn.dateFrom && desaproveTurn.dateTo) {
          const buttonId = this.getButtonId(desaproveTurn.classDayType.name, desaproveTurn.dateFrom, desaproveTurn.dateTo);
          this.desaproveTimeSlots.add(buttonId);
        }
      });
      this.updateButtonStates();
    });

    this.agendaService.obtenerTurnosAprobadosPorAgenda(this.agendaId).subscribe((aproveTurns) => {
      this.aproveTimeSlots = new Set<string>();
      aproveTurns.forEach((aproveTurn) => {

        if (aproveTurn.classDayType && aproveTurn.dateFrom && aproveTurn.dateTo) {
          const buttonId = this.getButtonId(aproveTurn.classDayType.name, aproveTurn.dateFrom, aproveTurn.dateTo);
          this.aproveTimeSlots.add(buttonId);
        }
      });
      this.updateButtonStates();
    });

    this.agendaService.obtenerTurnosReservadosConSeñaPorAgenda(this.agendaId).subscribe((reservedWtSignTimeSlots) => {
      this.reservedWtSignTimeSlots = new Set<string>();
      reservedWtSignTimeSlots.forEach((reservedWtSignTimeSlots) => {

        if (reservedWtSignTimeSlots.classDayType && reservedWtSignTimeSlots.dateFrom && reservedWtSignTimeSlots.dateTo) {
          const buttonId = this.getButtonId(reservedWtSignTimeSlots.classDayType.name, reservedWtSignTimeSlots.dateFrom, reservedWtSignTimeSlots.dateTo);
          this.reservedWtSignTimeSlots.add(buttonId);
        }
      });
      this.updateButtonStates();
    });
  }

  updateButtonStates() {
    for (const timeSlot of this.timeSlots) {
      for (const dayType of this.days2) {
        const buttonId = this.getButtonId(dayType, timeSlot.start, timeSlot.end);        
        if (this.reservedTimeSlots.has(buttonId)) {
          this.buttonStates[buttonId] = 'Reservado';
        } else if (this.availableTimeSlots.has(buttonId)) {
          this.buttonStates[buttonId] = 'Reservar';
        } else if (this.desaproveTimeSlots.has(buttonId)) {
          this.buttonStates[buttonId] = 'Ausente'
        } else if (this.aproveTimeSlots.has(buttonId)){
          this.buttonStates[buttonId] = 'Presente'
        } else if (this.reservedWtSignTimeSlots.has(buttonId)) {
          this.buttonStates[buttonId] = 'Reservado sin aprobar seña'
        }
      }
    }
  }

  getButtonId(classDayType: any, dateFrom: string, dateTo: string): string {
    return `${classDayType}-${dateFrom}-${dateTo}`;
  }

  loadAllTurns() {
    this.agendaService.obtenerTurnosPorAgenda(this.agendaId).subscribe((allTurns) => {
      allTurns.forEach((turn) => {
        const buttonId = this.getButtonId(turn.classDayType.name, turn.startTime, turn.endTime);
        if (turn.client != this.clientId) {
          this.buttonStates[buttonId] = 'Reservado';
        } else if (turn.client === this.clientId) {
          this.buttonStates[buttonId] = 'Reservado';
        } else {
          this.buttonStates[buttonId] = 'Reservar';
        }
      });
    });
  }

  generateTimeSlots() {
    if (this.scheduleData && this.scheduleData.turn) {
      this.timeSlots = [];
      for (const turn of this.scheduleData.turn) {
        const startTime = moment(turn.dateFrom).format('hh:mm A');
        const endTime = moment(turn.dateTo).format('hh:mm A');
        const timeSlot = { start: startTime, end: endTime };
        if (!this.timeSlots.some(ts => ts.start === timeSlot.start && ts.end === timeSlot.end)) {
          this.timeSlots.push(timeSlot);
        }
      }
    }
  }

  aprobarTurno(id: number) {
    this.agendaService.aprobarTurno(id).subscribe((data: any) => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El turno se ha anotado como presente correctamente.' });
      this.cargarTurnos(); // Agregar para actualizar las tablas
      this.cargarTurnos2(); // Agregar para actualizar las tablas
      this.loadReservedAndAvailableTurns();
    });

  }

  desaprobarTurno(id: number) {
    this.agendaService.desaprobarTurno(id).subscribe((data: any) => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El turno se ha anotado como ausente correctamente.' });
      this.cargarTurnos(); // Agregar para actualizar las tablas
      this.cargarTurnos2(); // Agregar para actualizar las tablas
      this.loadReservedAndAvailableTurns();
    });

  }

  isAppointmentScheduled(dayType: any, start: string, end: string): boolean {
    if (!this.scheduleData || !this.scheduleData.turn) {
      return false;
    }
    return this.scheduleData.turn.some((turn: any) => {
      return turn.classDayType.name === dayType && this.isTimeWithinRange(start, end, turn.dateFrom, turn.dateTo);
    });
  }

  isTimeWithinRange(checkStart: string, checkEnd: string, rangeStart: string, rangeEnd: string): boolean {
    const momentCheckStart = moment(checkStart, 'hh:mm A');
    const momentCheckEnd = moment(checkEnd, 'hh:mm A');
    const momentRangeStart = moment(rangeStart);
    const momentRangeEnd = moment(rangeEnd);
    return momentCheckStart.isSameOrAfter(momentRangeStart) && momentCheckEnd.isBefore(momentRangeEnd);
  }

  updateCurrentDate() {
    this.currentDate = moment();
  }
}

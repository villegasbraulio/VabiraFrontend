import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { AgendaService } from './agenda.service';
import { UserService } from '../users/users.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class AgendaComponent implements OnInit {
  @ViewChild('dt1') dataTable: Table | null = null;
  turns: any[];
  columnas: any[];
  turns2: any[];
  columnas2: any[];
  days: { name: string; monthDay: string }[] = [];
  days2: string[] = [];
  currentDate = moment();
  scheduleData: any;
  timeSlots: { start: string; end: string }[] = [];
  reservedTimeSlots: Set<string> = new Set<string>();
  availableTimeSlots: Set<string> = new Set<string>();
  clientId: any;
  agendaId: any;
  messages: Message[] = [];
  buttonStates: { [buttonId: string]: string } = {}; // Nuevo objeto para rastrear el estado de los botones

  constructor(private dialog: MatDialog, private messageService: MessageService,
    private agendaService: AgendaService, private userService: UserService,
    private activatedRoute: ActivatedRoute, private confirmationService: ConfirmationService) {

    this.turns = [];
    this.columnas = [
      { field: 'turn.dateFrom', header: 'Hora' },
      { field: 'turn?.client.user.firstName', header: 'Nombre' },
      { field: 'turn.turnStatus.turnStatusType.name', header: 'Estado' },
      { field: 'acciones', header: 'Acciones' },
    ];

    this.turns2 = [];
    this.columnas2 = [
      { field: 'currentDate', header: 'Fecha y Hora Actual' },
      { field: 'turn2.totalTurns', header: 'Turnos de la agenda' },
      { field: 'turn2.reservedTurns', header: 'Turnos reservados' },
      { field: 'turn2.availableTurns', header: 'Turnos disponibles' },
      { field: 'proximoCliente', header: 'Proximo cliente' },
    ];
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
    } else {
      this.agendaService.agendarTurno(id, toUpdate).subscribe((data: any) => {
        this.reservedTimeSlots.add(`${dayType}-${start}-${end}`);
        this.messages = [{ severity: 'success', summary: 'Éxito', detail: 'Turno reservado con éxito' }];
        this.buttonStates[this.getButtonId(dayType, start, end)] = 'Reservado';
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
  }

  updateButtonStates() {
    for (const timeSlot of this.timeSlots) {
      for (const dayType of this.days2) {
        const buttonId = this.getButtonId(dayType, timeSlot.start, timeSlot.end);
        if (this.reservedTimeSlots.has(buttonId)) {
          this.buttonStates[buttonId] = 'Reservado';
        } else if (this.availableTimeSlots.has(buttonId)) {
          this.buttonStates[buttonId] = 'Reservar';
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
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El turno se ha aprobado correctamente.' });
      this.cargarTurnos(); // Agregar para actualizar las tablas
      this.cargarTurnos2(); // Agregar para actualizar las tablas
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

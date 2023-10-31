import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReservarCitaComponent } from '../reservar-cita/reservar-cita.component';
import * as moment from 'moment';
import { AgendaService } from './agenda.service';
import { UserService } from '../users/users.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message, MessageService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  providers: [MessageService, ConfirmationService,]
})
export class AgendaComponent implements OnInit {
  days: { name: string; monthDay: string }[] = [];
  days2: string[] = [];
  currentDate = moment();
  scheduleData: any;
  timeSlots: { start: string; end: string }[] = [];
  reservedTimeSlots: Set<string> = new Set<string>();
  availableTimeSlots: Set<string> = new Set<string>();
  clientId: any
  agendaId: any
  messages: Message[] = [];

  constructor(private dialog: MatDialog, private messageService: MessageService,
    private agendaService: AgendaService, private userService: UserService,
    private activatedRoute: ActivatedRoute, private confirmationService: ConfirmationService) { }

  handleTimeClick(dayType: any, start: string, end: string) {
    // Encuentra el turno correspondiente en base a las fechas y el tipo de día
    const selectedTurn = this.scheduleData.turn.find((turn: any) => {
      const turnStartTime = moment(turn.dateFrom).format('hh:mm A');
      const turnEndTime = moment(turn.dateTo).format('hh:mm A');

      const isSameDayType = turn.classDayType.name === dayType;
      const isAfterOrEqualStart = moment(start, 'hh:mm A').isSameOrAfter(moment(turnStartTime, 'hh:mm A'));
      const isBeforeOrEqualEnd = moment(end, 'hh:mm A').isSameOrBefore(moment(turnEndTime, 'hh:mm A'));

      return isSameDayType && isAfterOrEqualStart && isBeforeOrEqualEnd;
    });

    if (!selectedTurn) {
      // No se encontró un turno que coincida, puedes mostrar un mensaje de error si es necesario
      console.log('No se encontró un turno que coincida.');
      return;
    }


    const id = selectedTurn.id;
    const clienteId = this.clientId; // Cambia esto según la lógica de tu aplicación
    const toUpdate = {
      client: clienteId,
      classDayType: selectedTurn.classDayType, // Asegúrate de incluir estos datos
      startTime: start,
      endTime: end
    };

    if (this.reservedTimeSlots.has(`${dayType}-${start}-${end}`)) {
      this.agendaService.cancelarTurno(id, toUpdate).subscribe((data: any) => {
        this.reservedTimeSlots.add(`${dayType}-${start}-${end}`);

        this.updateButtonStates();

        this.messages = [{ severity: 'success', summary: 'Éxito', detail: 'Turno cancelado con éxito' }];

      });
    } else {
      this.agendaService.agendarTurno(id, toUpdate).subscribe((data: any) => {
        this.reservedTimeSlots.add(`${dayType}-${start}-${end}`);

        this.updateButtonStates();

        this.messages = [{ severity: 'success', summary: 'Éxito', detail: 'Turno reservado con éxito' }];
      });
    }

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.agendaId = +params['id'];
      this.userService.obtenerPerfilCliente().subscribe(
        (data: any) => {
          this.clientId = data;
          console.log(this.clientId);
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

        this.generateTimeSlots();
        this.loadReservedAndAvailableTurns();
        this.loadAllTurns();
        this.updateButtonStates();
      });
    });

  }

  loadReservedAndAvailableTurns() {
    // Obtener los turnos reservados y disponibles del servicio
    this.agendaService.obtenerTurnosReservadosPorAgenda(this.agendaId).subscribe((reservedTurns) => {
      this.reservedTimeSlots = new Set<string>();
      reservedTurns.forEach((reservedTurn) => {

        if (
          reservedTurn.classDayType &&
          reservedTurn.dateFrom &&
          reservedTurn.dateTo
        ) {
          const buttonId = this.getButtonId(reservedTurn.classDayType.name, reservedTurn.dateFrom, reservedTurn.dateTo);
          this.reservedTimeSlots.add(buttonId);
        }
      });
      console.log(this.reservedTimeSlots);

      // Luego de cargar los turnos reservados, obtener los turnos disponibles
      this.agendaService.obtenerTurnosDisponiblesPorAgenda(this.agendaId).subscribe((availableTurns) => {
        this.availableTimeSlots = new Set<string>();
        availableTurns.forEach((availableTurn) => {
          // Asegúrate de que los datos necesarios estén disponibles en availableTurn
          if (
            availableTurn.classDayType &&
            availableTurn.dateFrom &&
            availableTurn.dateTo
          ) {
            const buttonId = this.getButtonId(availableTurn.classDayType.name, availableTurn.dateFrom, availableTurn.dateTo);

            this.availableTimeSlots.add(buttonId);
          }
        });
        console.log(this.availableTimeSlots);
        this.updateButtonStates();
      });
    });
  }

  updateButtonStates() {
    for (const timeSlot of this.timeSlots) {
      for (const dayType of this.days2) {
        const buttonId = this.getButtonId(dayType, timeSlot.start, timeSlot.end);
        const buttonElement = document.getElementById(buttonId) as HTMLButtonElement;
        if (buttonElement && buttonElement instanceof HTMLButtonElement) {
          if (this.reservedTimeSlots.has(buttonId)) {
            // El turno está reservado
            buttonElement.innerText = 'Reservado';
            buttonElement.classList.add('reserved-button');
            buttonElement.disabled = false; // Deshabilitar el botón
          } else if (this.availableTimeSlots.has(buttonId)) {
            // El turno está disponible
            buttonElement.innerText = 'Reservar';
            buttonElement.classList.add('available-button');
          }
        }
      }
    }
  }

  getButtonId(classDayType: any, dateFrom: string, dateTo: string): string {
    return `${classDayType}-${dateFrom}-${dateTo}`;
  }

  loadReservedTurns() {
    // Obtener los turnos reservados del servicio
    this.agendaService.obtenerTurnosReservadosPorAgenda(this.agendaId).subscribe((reservedTurns) => {
      reservedTurns.forEach((reservedTurn) => {
        const buttonId = this.getButtonId(reservedTurn.classDayType.name, reservedTurn.startTime, reservedTurn.endTime);
        const buttonElement = document.getElementById(buttonId) as HTMLButtonElement;
        if (buttonElement) {
          buttonElement.innerText = 'Reservado';
          buttonElement.classList.add('reserved-button');
          buttonElement.disabled = true; // Deshabilitar el botón
        }
      });
    });
  }

  loadAllTurns() {
    this.agendaService.obtenerTurnosPorAgenda(this.agendaId).subscribe((allTurns) => {
      allTurns.forEach((turn) => {
        const buttonId = this.getButtonId(turn.classDayType.name, turn.startTime, turn.endTime);
        const buttonElement = document.getElementById(buttonId) as HTMLButtonElement;
        if (buttonElement) {
          if (turn.client != this.clientId) {
            buttonElement.innerText = 'Reservado';
            buttonElement.classList.add('reserved-button');
            buttonElement.disabled = true; // Deshabilitar el botón para los turnos reservados
          } else if (turn.client === this.clientId) {
            buttonElement.innerText = 'Reservado';
            buttonElement.classList.add('reserved-button');
            buttonElement.disabled = false;
          } else {
            buttonElement.innerText = 'Reservar';
            buttonElement.classList.add('available-button');
          }
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

        // Verifica si el intervalo de tiempo ya existe en la lista antes de agregarlo
        if (!this.timeSlots.some(ts => ts.start === timeSlot.start && ts.end === timeSlot.end)) {
          this.timeSlots.push(timeSlot);
        }
      }
    }
  }

  agendarTurno(id: number, toUpdate: any) {
    this.agendaService.agendarTurno(id, toUpdate).subscribe((data: any) => {
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

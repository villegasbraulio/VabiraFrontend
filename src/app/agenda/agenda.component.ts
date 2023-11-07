import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { AgendaService } from './agenda.service';
import { UserService } from '../users/users.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message, MessageService, ConfirmEventType } from 'primeng/api';
import { Table } from 'primeng/table';
interface Column {
  field: string;
  header: string;
}
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  providers: [MessageService, ConfirmationService,]
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
  clientId: any
  agendaId: any
  messages: Message[] = [];

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

      // Verificar que data sea una matriz de objetos
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        // Verificar que los nombres de las propiedades coincidan exactamente con los campos en globalFilterFields
        const objectProperties = Object.keys(firstItem);
      }
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
        // Asegurémonos de que data tenga la estructura esperada
        if (data.totalTurns !== undefined && data.reservedTurns !== undefined && data.availableTurns !== undefined) {
          this.turns2 = [{
            totalTurns: data.totalTurns,
            reservedTurns: data.reservedTurns,
            availableTurns: data.availableTurns,
          }];

          // Encuentra el próximo cliente
          const currentMoment = moment();
          let proximoCliente = '';

          if (Array.isArray(data.reservedTurns2) && data.reservedTurns2.length > 0) {

            let minDiff = Number.MAX_VALUE;

            for (const reservedTurn of data.reservedTurns2) {
              if (reservedTurn.dateFrom) {
                const turnoMoment = moment(reservedTurn.dateFrom);

                const diff = turnoMoment.diff(currentMoment);
                if (diff > 0 && diff < minDiff) {
                  minDiff = diff;
                  const nombre = reservedTurn.client?.user?.firstName || '';
                  const apellido = reservedTurn.client?.user?.lastName || ''; // Agrega el apellido
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
    moment.locale('es'); // Establece la localización en español
    const formattedDate = moment(date).format('HH:mm dddd DD-MM');
    const words = formattedDate.split(' ');
    if (words.length > 1) {
      // Convierte la primera letra en mayúscula
      words[1] = words[1].charAt(0).toUpperCase() + words[1].slice(1);
    }
    return words.join(' ');
  }


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
        this.availableTimeSlots.add(`${dayType}-${start}-${end}`);


        this.messages = [{ severity: 'success', summary: 'Éxito', detail: 'Turno cancelado con éxito' }];
        this.updateButtonStates();
        window.location.reload();

      });
    } else {
      this.agendaService.agendarTurno(id, toUpdate).subscribe((data: any) => {
        this.reservedTimeSlots.add(`${dayType}-${start}-${end}`);


        this.messages = [{ severity: 'success', summary: 'Éxito', detail: 'Turno reservado con éxito' }];
        this.updateButtonStates();
        window.location.reload();
      });
    }

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
          } else if (turn.client === this.clientId) {
            buttonElement.innerText = 'Reservado';
            buttonElement.classList.add('reserved-button');
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
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El turno se ha reservado correctamente.' });
    });
  }

  aprobarTurno(id: number) {
    this.agendaService.aprobarTurno(id).subscribe((data: any) => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El turno se ha aprobado correctamente.' });
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
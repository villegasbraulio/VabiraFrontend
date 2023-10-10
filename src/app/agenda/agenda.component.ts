import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReservarCitaComponent } from '../reservar-cita/reservar-cita.component';
import * as moment from 'moment';
import { AgendaService } from './agenda.service';
import { UserService } from '../users/users.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  days: string[] = [];
  currentDate = moment();
  scheduleData: any;
  timeSlots: { start: string; end: string }[] = [];
  reservedTimeSlots: Set<string> = new Set<string>();
  availableTimeSlots: Set<string> = new Set<string>();
  clientId: any

  constructor(private dialog: MatDialog, private agendaService: AgendaService, private userService: UserService) { }



  ngOnInit(): void {

    this.userService.obtenerPerfil().subscribe({
      next: (clientFound) => {
        this.clientId = clientFound;
      }
    });

    this.agendaService.obtenerAgenda(8).subscribe((data) => {
      this.scheduleData = data;
      this.days = this.scheduleData.turn
        .reduce((uniqueDays: string[], turn: any) => {
          if (!uniqueDays.includes(turn.classDayType.name)) {
            uniqueDays.push(turn.classDayType.name);
          }
          return uniqueDays;
        }, []);
      this.generateTimeSlots();

      // Cargar todos los turnos al inicio
      this.loadReservedAndAvailableTurns();
      this.loadAllTurns();
      this.updateButtonStates();
    });
  }

  // ...
  loadReservedAndAvailableTurns() {
    // Obtener los turnos reservados y disponibles del servicio
    this.agendaService.obtenerTurnosReservados().subscribe((reservedTurns) => {
      this.reservedTimeSlots = new Set<string>();
      reservedTurns.forEach((reservedTurn) => {
        // Asegúrate de que los datos necesarios estén disponibles en reservedTurn
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
      this.agendaService.obtenerTurnosDisponibles().subscribe((availableTurns) => {
        this.availableTimeSlots = new Set<string>();
        availableTurns.forEach((availableTurn) => {
          // Asegúrate de que los datos necesarios estén disponibles en availableTurn
          if (
            availableTurn.classDayType &&
            availableTurn.dateFrom &&
            availableTurn.dateTo
          ) {
            const buttonId = this.getButtonId(availableTurn.classDayType.name, availableTurn.dateFrom, availableTurn.dateTo);
            // console.log('button id posta: ', buttonId);
            this.availableTimeSlots.add(buttonId);
          }
        });

        // Ahora, puedes actualizar los estados de los botones según la disponibilidad y reserva
        this.updateButtonStates();
      });
    });
  }
  // ...


  updateButtonStates() {
    for (const timeSlot of this.timeSlots) {
      for (const dayType of this.days) {
        const buttonId = this.getButtonId(dayType, timeSlot.start, timeSlot.end);
        console.log('buttonId este?: ', buttonId);
        const buttonElement = document.getElementById(buttonId) as HTMLButtonElement;
        if (buttonElement && buttonElement instanceof HTMLButtonElement) {
          console.log('reservedTimeSlots: ', this.reservedTimeSlots);
          console.log('availableTimeSlots: ', this.availableTimeSlots);
  
          if (this.reservedTimeSlots.has(buttonId)) {
            console.log('entro?');
            // El turno está reservado
            buttonElement.innerText = 'Reservado';
            buttonElement.classList.add('reserved-button');
            buttonElement.disabled = true; // Deshabilitar el botón
          } else if (this.availableTimeSlots.has(buttonId)) {
            // El turno está disponible
            buttonElement.innerText = 'Reservar';
            buttonElement.classList.add('available-button');
          } else {
            // El turno no está reservado ni disponible
            buttonElement.innerText = 'No disponible';
            buttonElement.classList.add('unavailable-button');
            buttonElement.disabled = true; // Deshabilitar el botón
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
    this.agendaService.obtenerTurnosReservados().subscribe((reservedTurns) => {
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
    this.agendaService.obtenerTurnos().subscribe((allTurns) => {
      allTurns.forEach((turn) => {
        const buttonId = this.getButtonId(turn.classDayType.name, turn.startTime, turn.endTime);
        const buttonElement = document.getElementById(buttonId) as HTMLButtonElement;
        if (buttonElement) {
          if (turn.client) {
            buttonElement.innerText = 'Reservado';
            buttonElement.classList.add('reserved-button');
            buttonElement.disabled = true; // Deshabilitar el botón para los turnos reservados
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

  isClientAssigned(dayType: string, start: string, end: string): boolean {
    if (!this.scheduleData || !this.scheduleData.turn) {
      return false;
    }

    const selectedTurn = this.scheduleData.turn.find((turn: any) => {
      return (
        turn.classDayType.name === dayType &&
        moment(start, 'hh:mm A').isSameOrAfter(moment(turn.dateFrom)) &&
        moment(end, 'hh:mm A').isSameOrBefore(moment(turn.dateTo))
      );
    });

    return selectedTurn && selectedTurn.client !== null;
  }

  agendarTurno(id: number, toUpdate: any) {
    // Llama al método del servicio para eliminar el usuario por su ID
    this.agendaService.agendarTurno(id, toUpdate).subscribe((data: any) => {
      // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
    });
  }

  isAppointmentScheduled(dayType: string, start: string, end: string): boolean {
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

  handleTimeClick(dayType: string, start: string, end: string) {
    if (this.reservedTimeSlots.has(`${dayType}-${start}-${end}`)) {
      // El turno ya está reservado, puedes mostrar un mensaje o realizar acciones adicionales
      return;
    }

    // Encuentra el turno correspondiente en base a las fechas y el tipo de día
    const selectedTurn = this.scheduleData.turn.find((turn: any) => {
      return (
        turn.classDayType.name === dayType &&
        moment(start, 'hh:mm A').isSameOrAfter(moment(turn.dateFrom)) &&
        moment(end, 'hh:mm A').isSameOrBefore(moment(turn.dateTo))
      );
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

    // Llama al método del servicio para agendar el turno
    this.agendaService.agendarTurno(id, toUpdate).subscribe((data: any) => {
      // Si se realiza la reserva con éxito, agrega el turno a la lista de reservados
      this.reservedTimeSlots.add(`${dayType}-${start}-${end}`);

      // Actualiza el botón a "Reservado" y aplica un estilo diferente (cambia el fondo a rojo)
      this.updateButtonStates(); // Llama a updateButtonStates aquí

      // Almacena el turno reservado en localStorage
      localStorage.setItem(`${dayType}-${start}-${end}`, 'reservado');
    });
  }

}

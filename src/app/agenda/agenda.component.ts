import { Component, OnInit } from '@angular/core';
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
  
  constructor(private dialog: MatDialog, private agendaService: AgendaService, private userService: UserService) { }
  clientId: any
  

  ngOnInit(): void {
    this.userService.obtenerPerfil().subscribe({
      next: (clientFound) => {this.clientId = clientFound
      }
    }
    );
    this.agendaService.obtenerAgenda(2).subscribe((data) => {
      this.scheduleData = data;
      this.days = this.scheduleData.turn
        .reduce((uniqueDays: string[], turn: any) => {
          if (!uniqueDays.includes(turn.classDayType.name)) {
            uniqueDays.push(turn.classDayType.name);
          }
          return uniqueDays;
        }, []);
      this.generateTimeSlots();
      
      this.agendaService.obtenerTurnosReservados().subscribe((reservedTurns) => {
        this.loadReservedTurns(reservedTurns);
      });
    });
  }

  loadReservedTurns(reservedTurns: any[]) {
    // Iterar sobre los turnos reservados y actualizar el estado de los botones
    reservedTurns.forEach((reservedTurn) => {
      const buttonElement = document.getElementById(`${reservedTurn.dayType}-${reservedTurn.startTime}-${reservedTurn.endTime}`);
      if (buttonElement) {
        buttonElement.innerText = 'Reservado';
        buttonElement.classList.add('reserved-button');
        this.reservedTimeSlots.add(`${reservedTurn.dayType}-${reservedTurn.startTime}-${reservedTurn.endTime}`);
      }
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
    };
  
    // Llama al método del servicio para agendar el turno
    this.agendaService.agendarTurno(id, toUpdate).subscribe((data: any) => {
      // Si se realiza la reserva con éxito, agrega el turno a la lista de reservados
      this.reservedTimeSlots.add(`${dayType}-${start}-${end}`);
  
      // Actualiza el botón a "Reservado" y aplica un estilo diferente (cambia el fondo a rojo)
      const buttonElement = document.getElementById(`${dayType}-${start}-${end}`);
      if (buttonElement) {
        buttonElement.innerText = 'Reservado';
        buttonElement.classList.add('reserved-button');
      }
  
      // Almacena la reserva en el almacenamiento local
      localStorage.setItem(`${dayType}-${start}-${end}`, 'reservado');
      this.updateButtonStates();
    });
  }
  
  // Actualiza el estado de los botones según los valores almacenados en el almacenamiento local
  updateButtonStates() {
    this.timeSlots.forEach((timeSlot) => {
      this.days.forEach((dayType) => {
        const buttonElement = document.getElementById(`${dayType}-${timeSlot.start}-${timeSlot.end}`);
        if (buttonElement) {
          const reservationStatus = localStorage.getItem(`${dayType}-${timeSlot.start}-${timeSlot.end}`);
          if (reservationStatus === 'reservado') {
            // Si está reservado, cambia el botón a "Reservado" y aplica el estilo rojo
            buttonElement.innerText = 'Reservado';
            buttonElement.classList.add('reserved-button');
          }
        }
      });
    });
  }

  getButtonId(dayType: string, start: string, end: string): string {
    return `${dayType}-${start}-${end}`;
  }

}

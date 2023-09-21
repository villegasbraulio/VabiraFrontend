import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReservarCitaComponent } from '../reservar-cita/reservar-cita.component';
import * as moment from 'moment';
import { AgendaService } from './agenda.service';

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

  constructor(private dialog: MatDialog, private agendaService: AgendaService) {}

  ngOnInit(): void {
    this.agendaService.obtenerAgenda(3).subscribe((data) => {
      this.scheduleData = data;
      this.days = this.scheduleData.turn
        .reduce((uniqueDays: string[], turn: any) => {
          if (!uniqueDays.includes(turn.classDayType.name)) {
            uniqueDays.push(turn.classDayType.name);
          }
          return uniqueDays;
        }, []);
      this.generateTimeSlots();
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
    const dialogRef = this.dialog.open(ReservarCitaComponent, {
      data: { day: dayType, time: `${start} - ${end}` }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Si se realiza la reserva, puedes realizar acciones adicionales aquí
      }
    });
  }

  openAppointmentDetails(dayType: string, start: string, end: string) {
    // Implementa la lógica para abrir los detalles de la cita según los parámetros proporcionados.
    // Puedes usar un cuadro de diálogo o ventana emergente para mostrar los detalles de la cita.
    // Puedes acceder a los detalles de la cita utilizando los parámetros proporcionados.
  }

  getAppointmentUserName(dayType: string, start: string, end: string): string {
    // Implementa la lógica para obtener el nombre del usuario de la cita programada para los parámetros proporcionados.
    // Retorna el nombre del usuario.
    // Puedes buscar en tus datos utilizando los parámetros proporcionados.
    return ''; // Esto es un ejemplo, debes cambiarlo según tu lógica.
  }
}

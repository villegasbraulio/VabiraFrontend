import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReservarCitaComponent } from '../reservar-cita/reservar-cita.component';
import * as moment from 'moment';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent {
  horarios: string[] = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
  ];

  days: string[] = []; // Actualizaremos esta propiedad con los días de la semana actual
  currentDate = moment();
  weekDays: { day: string; date: string }[] = [];

  constructor(private dialog: MatDialog) {
    // Calcula la fecha de inicio de la semana actual (lunes)
    const startOfWeek = this.currentDate.clone().startOf('week');

    // Calcula los días de la semana actual
    for (let i = 0; i < 5; i++) { // Solo necesitas 5 días laborables
      const dayDate = startOfWeek.clone().add(i, 'days');
      this.days.push(dayDate.format('dddd DD/MM'));
    }
  }

  updateCurrentDate() {
    this.currentDate = moment();
  }

  handleTimeClick(day: string, time: string) {
    const dialogRef = this.dialog.open(ReservarCitaComponent, {
      data: { day, time }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Si se realiza la reserva, puedes realizar acciones adicionales aquí
      }
    });
  }
  isAppointmentScheduled(day: string, time: string): boolean {
    // Aquí debes implementar la lógica para verificar si hay una cita programada para el día y la hora especificados.
    // Retorna true si está ocupado, false si está libre.
    // Por ejemplo, podrías verificar si existe un objeto de cita en tu estructura de datos 'appointments'.
    return false; // Esto es un ejemplo, debes cambiarlo según tu lógica.
  }
  
  openAppointmentDetails(day: string, time: string) {
    // Aquí debes implementar la lógica para abrir los detalles de la cita.
    // Puedes usar un cuadro de diálogo o una ventana emergente para mostrar los detalles de la cita.
    // Puedes acceder a los detalles de la cita utilizando 'day' y 'time' para buscar en tus datos.
  }
  
  getAppointmentUserName(day: string, time: string): string {
    // Aquí debes implementar la lógica para obtener el nombre del usuario de la cita programada para el día y la hora especificados.
    // Retorna el nombre del usuario.
    // Por ejemplo, podrías buscar en tu estructura de datos 'appointments'.
    return ''; // Esto es un ejemplo, debes cambiarlo según tu lógica.
  }
  
}



  // abrirVentanaReserva(day: string, time: string) {
  //   const dialogRef = this.dialog.open(ReservarCitaComponent, {
  //     data: { day, time }
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     // Manejar el resultado después de la reserva
  //   });
  // }

  // abrirVentanaDetallesCita(cita: any) {
  //   const dialogRef = this.dialog.open(DetallesCitaComponent, {
  //     data: cita
  //   });

  //   dialogRef.afterClosed().subscribe(() => {
  //     // Puedes agregar lógica adicional después de cerrar los detalles de la cita
  //   });
  // }
  // Resto de tu lógica para manejar los turnos
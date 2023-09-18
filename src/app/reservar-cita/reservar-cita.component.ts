// reservar-cita.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reservar-cita',
  templateUrl: './reservar-cita.component.html',
  styleUrls: ['./reservar-cita.component.css']
})
export class ReservarCitaComponent {
  nombre: string = '';
  apellido: string = '';
  username: string = '';
  selectedDay: string = '';
  selectedTime: string = '';

  constructor(
    public dialogRef: MatDialogRef<ReservarCitaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedDay = data.day;
    this.selectedTime = data.time;
  }

  reservarCita() {
    // Aquí puedes acceder a this.nombre, this.apellido y this.username
    // para obtener los datos ingresados por el usuario.
    // También puedes acceder a this.selectedDay y this.selectedTime
    // para obtener el día y la hora seleccionados.
    // Implementa la lógica de reserva de cita aquí.
    // Por ejemplo, podrías enviar estos datos al servidor o guardarlos en tu sistema.
    // Luego, cierra el cuadro de diálogo.
    this.dialogRef.close();
  }

  cancelar() {
    // Si el usuario cancela, simplemente cierra el cuadro de diálogo sin realizar ninguna acción.
    this.dialogRef.close();
  }
}

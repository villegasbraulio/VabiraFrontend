import { Component } from '@angular/core';
import { TurneroService } from './turnero.service';
import { TimeRangeModalComponent } from '../time-range-modal/time-range-modal.component';
import { NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-turnero',
  templateUrl: './turnero.component.html',
  styleUrls: ['./turnero.component.css']
})
export class TurneroComponent {
  scheduleData: any = {
    days: [], // Aquí almacenaremos los días seleccionados desde el frontend
    initialTurnDateTime: '', // Aquí almacenaremos la hora de inicio seleccionada desde el frontend
    finalTurnDateTime: '', // Aquí almacenaremos la hora de finalización seleccionada desde el frontend
    turnDuration: 30, // Aquí almacenaremos la duración del turno seleccionada desde el frontend
    name: '', // Aquí almacenaremos el nombre seleccionado desde el frontend
    // supplier: {
    //   // Agrega los datos de tu proveedor aquí si es necesario
    // },
  };
  selectedStartTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  selectedEndTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };

  days: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado", "Domingo"];

  constructor(private turneroService: TurneroService, private modalService: NgbModal) { }

  async createSchedule() {
    try {
      const selectedTimeRange = await this.openTimeRangeModal();
  
      // Actualiza los atributos en scheduleData
      this.scheduleData.initialTurnDateTime = this.convertTimeStructToString(selectedTimeRange.startTime);
      this.scheduleData.finalTurnDateTime = this.convertTimeStructToString(selectedTimeRange.endTime);
      
      // Luego, puedes continuar con la creación de la agenda y enviar los datos al servicio.
      this.turneroService.createSchedule(this.scheduleData).subscribe(
        (response) => {
          console.log('Horario creado con éxito:', response);
          // Realiza acciones adicionales si es necesario
        },
        (error) => {
          console.error('Error al crear el horario:', error);
          // Maneja el error de acuerdo a tus necesidades
        }
      );
    } catch (error) {
      console.error('Error al abrir el modal de rango horario:', error);
      // Maneja el error según tus necesidades
    }
  }
  

  toggleDay(day: string) {
    const index = this.scheduleData.days.indexOf(day);
    if (index === -1) {
      // Si el día no está en el array, lo agregamos
      this.scheduleData.days.push(day);
    } else {
      // Si el día está en el array, lo quitamos
      this.scheduleData.days.splice(index, 1);
    }
  }

  isDaySelected(day: string): boolean {
    return this.scheduleData.days.includes(day);
  }

  openTimeRangeModal(): Promise<{ startTime: NgbTimeStruct; endTime: NgbTimeStruct }> {
    return new Promise((resolve, reject) => {
      const modalRef = this.modalService.open(TimeRangeModalComponent);
      
      modalRef.componentInstance.timeRangeSelected.subscribe((selectedTimeRange: { startTime: NgbTimeStruct; endTime: NgbTimeStruct }) => {
        resolve(selectedTimeRange);
      });
    });
  }

  // async onOpenTimeRangeModal() {
    
  //   try {
  //     const selectedTimeRange = await this.openTimeRangeModal();

  //     // Actualiza los atributos en scheduleData
  //     this.scheduleData.initialTurnDateTime = this.convertTimeStructToString(selectedTimeRange.startTime);
  //     this.scheduleData.finalTurnDateTime = this.convertTimeStructToString(selectedTimeRange.endTime);
  //     console.log(this.scheduleData.initialTurnDateTime);
  //     console.log(this.scheduleData.finalTurnDateTime);
      

  //     // Luego, puedes continuar con la creación de la agenda y enviar los datos al servicio.
  //     this.turneroService.createSchedule(this.scheduleData).subscribe(
  //       (response) => {
  //         console.log('Horario creado con éxito:', response);
  //         // Realiza acciones adicionales si es necesario
  //       },
  //       (error) => {
  //         console.error('Error al crear el horario:', error);
  //         // Maneja el error de acuerdo a tus necesidades
  //       }
  //     );
  //   } catch (error) {
  //     console.error('Error al abrir el modal de rango horario:', error);
  //     // Maneja el error según tus necesidades
  //   }
  // }

  private convertTimeStructToString(timeStruct: NgbTimeStruct): string {
    // Convierte el objeto NgbTimeStruct en una cadena de tiempo (por ejemplo, "HH:MM:SS")
    return `${timeStruct.hour}:${timeStruct.minute}`;
  }
}

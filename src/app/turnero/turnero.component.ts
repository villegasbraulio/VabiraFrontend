import { Component, ViewChild } from '@angular/core';
import { TurneroService } from './turnero.service';
import { TimeRangeModalComponent } from '../time-range-modal/time-range-modal.component';
import { NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from './success-modal.component';
import { UserService } from '../users/users.service';
import { ProveedorService } from '../proveedor/proveedor.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-turnero',
  templateUrl: './turnero.component.html',
  styleUrls: ['./turnero.component.css'],
  providers: [MessageService] // Agrega el MessageService como proveedor
})
export class TurneroComponent {
  @ViewChild(TimeRangeModalComponent) timeRangeModal?: TimeRangeModalComponent; // Agrega esta línea
  isSign: boolean = false;
  scheduleData: any = {
    days: [], // Aquí almacenaremos los días seleccionados desde el frontend
    initialTurnDateTime: '', // Aquí almacenaremos la hora de inicio seleccionada desde el frontend
    finalTurnDateTime: '', // Aquí almacenaremos la hora de finalización seleccionada desde el frontend
    turnDuration: 30, // Aquí almacenaremos la duración del turno seleccionada desde el frontend
    name: '', // Aquí almacenaremos el nombre seleccionado desde el frontend
    sign: 0,
    hasSign: false,
    alias: '',
    supplier: {
    },
    dates: []
  };
  sign: number = 0;
  alias: string = '';
  supplierId: any;
  selectedDates: Date[] = [];
  selectedStartTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  selectedEndTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };


  days: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado", "Domingo"];

  constructor(
    private turneroService: TurneroService,
    private modalService: NgbModal,
    private userService: UserService,
    private proveedorService: ProveedorService, 
    private messageService: MessageService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.userService.obtenerPerfil().subscribe(
      (data: any) => {
        this.supplierId = data;
        console.log(this.supplierId);
      },
      (error) => {
        console.error('Error al obtener los datos del proveedor:', error);
      }
    );
  }
  async createSchedule() {
    try {
      // Luego, puedes continuar con la creación de la agenda y enviar los datos al servicio.
      if (this.scheduleData.initialTurnDateTime == '') {
        // Maneja el error de acuerdo a tus necesidades
        this.showErrorMessage('El rango horario no fue seleccionado');
        return;
      }
      if(this.isSign === true){
        this.scheduleData.hasSign = true
        this.scheduleData.sign = this.sign
        this.scheduleData.alias = this.alias
        
        if (this.isSign && (this.sign < 0 || this.sign === 0) ) {
          // Si la seña es negativa, muestra un mensaje de error y no continúa con la creación de la agenda
          this.showErrorMessage('La seña no puede ser un número negativo o igual a cero.');
          return;
        }
        if (this.isSign && this.alias === '') {
          // Si la seña es negativa, muestra un mensaje de error y no continúa con la creación de la agenda
          this.showErrorMessage('El alias es un campo requerido.');
          return;
        }
      }

      
      if (this.scheduleData.finalTurnDateTime < this.scheduleData.initialTurnDateTime) {
        // Si la seña es negativa, muestra un mensaje de error y no continúa con la creación de la agenda
        this.showErrorMessage('La hora de fin no puede ser menor que la hora de inicio ya que la hora de seleccion es por dia 00:00-23:59');
        return;
      }
      this.scheduleData.supplier = this.supplierId
      console.log('scheduleData', this.scheduleData);
      console.log('scheduleData supplier', this.scheduleData.supplier);
      
      this.turneroService.createSchedule(this.scheduleData).subscribe(
        
        (response) => {
          console.log('Horario creado con éxito:', response);
          // this.showSuccessModal();
          this.showSuccessMessage('Agenda creada con éxito');
        },
        (error) => {
          console.error('Error al crear el horario:', error);
          this.showErrorMessage('Error al crear el horario');
          // Maneja el error de acuerdo a tus necesidades
        }
      );
    } catch (error) {
      console.error('Error al abrir el modal de rango horario:', error);
      // Maneja el error según tus necesidades
      this.showErrorMessage('Error al abrir el modal de rango horario');
    }
  }
  private showSuccessMessage(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: message });
  }

  private showErrorMessage(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
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

  async onOpenTimeRangeModal() {

    try {
      const selectedTimeRange = await this.openTimeRangeModal();

      // Actualiza los atributos en scheduleData
      this.scheduleData.initialTurnDateTime = this.convertTimeStructToString(selectedTimeRange.startTime);
      this.scheduleData.finalTurnDateTime = this.convertTimeStructToString(selectedTimeRange.endTime);


    } catch (error) {
      console.error('Error al abrir el modal de rango horario:', error);
      // Maneja el error según tus necesidades
    }
  }

  private convertTimeStructToString(timeStruct: NgbTimeStruct): string {
    // Convierte el objeto NgbTimeStruct en una cadena de tiempo (por ejemplo, "HH:MM:SS")
    return `${timeStruct.hour}:${timeStruct.minute}`;
  }

  showSuccessModal() {
    const modalRef = this.modalService.open(SuccessModalComponent, { centered: true }); // Abre el modal de éxito

    // Puedes configurar el contenido del modal aquí, si es necesario
    modalRef.componentInstance.title = 'Éxito'; // Por ejemplo, configurar el título
    modalRef.componentInstance.message = 'La operación se realizó con éxito.'; // Configurar el mensaje de éxito
  }

  onSelectDate(event: any) {
    // Este evento se activa cuando el usuario selecciona una fecha en el calendario
    console.log('Fechas seleccionadas:', event);

    if (Array.isArray(event)) {
      // Si se seleccionaron múltiples fechas, obtén los nombres de los días de las fechas seleccionadas
      const selectedDays = event.map((date: Date) => this.getWeekdayName(date));

      // Actualiza el array de "days" con los días seleccionados en el calendario
      this.scheduleData.days = selectedDays;
    } else if (event instanceof Date) {
      // Si se seleccionó una fecha individual, obtén el nombre del día de la semana
      const selectedDay = this.getWeekdayName(event);

      // Agrega el día a la lista si aún no está presente
      if (!this.scheduleData.days.includes(selectedDay)) {
        this.scheduleData.days.push(selectedDay);
      }
    } else {
      console.error('El evento no es una fecha o un array de fechas:', event);
      // Maneja el error de acuerdo a tus necesidades
    }
    
  }

  private getWeekdayName(date: Date): string {
    // Asegúrate de que el formato de fecha coincida con el proporcionado por el calendario
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[date.getDay()];
  }

}



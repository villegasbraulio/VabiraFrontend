import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-time-range-modal',
  templateUrl: './time-range-modal.component.html',
})
export class TimeRangeModalComponent {
  @Output() timeRangeSelected: EventEmitter<{ startTime: NgbTimeStruct; endTime: NgbTimeStruct }> = new EventEmitter();
  @Input() startTime!: NgbTimeStruct;
  @Input() endTime!: NgbTimeStruct;

  constructor(public activeModal: NgbActiveModal) {}

  closeModal() {
    this.activeModal.dismiss();
  }

  saveTimeRange() {
    // Aquí puedes realizar acciones con los valores seleccionados, como validar o enviar al componente principal.
    this.timeRangeSelected.emit({
      startTime: this.startTime,
      endTime: this.endTime,
    });
    this.activeModal.close(); // Cierra el modal después de emitir el evento
  }
  
  
  onTimeRangeSelected(startTime: NgbTimeStruct, endTime: NgbTimeStruct) {
    this.timeRangeSelected.emit({ startTime, endTime });
  }

  // Ajusta el formato de las horas para eliminar los segundos
  private adjustTimeFormat(timeStruct: NgbTimeStruct): NgbTimeStruct {
    return {
      hour: timeStruct.hour,
      minute: timeStruct.minute,
      second: 0, // Establece los segundos en cero
    };
  }
}

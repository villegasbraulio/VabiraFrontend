import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private nuevoTurnoSource = new BehaviorSubject<any>(null);
  nuevoTurno$ = this.nuevoTurnoSource.asObservable();

  constructor() { }

enviarNuevoTurno(turno: any) {
  console.log('Nuevo turno enviado desde NotificacionesService:', turno);
  this.nuevoTurnoSource.next(turno);
}
  
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { NotificacionesService } from '../notificaciones/notificaciones.service'; // Importa el servicio de notificaciones

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private baseUrl = 'http://localhost:3000/api/schedule';
  private baseUrl2 = 'http://localhost:3000/api/turn';

  constructor(private http: HttpClient, private notificacionesService: NotificacionesService) { } // Inyecta NotificacionesService

  obtenerAgendas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/findAll`);//trae todas las agendas
  }

  obtenerTurnos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/findAll`);//trae todos los turnos
  }

  obtenerTurnosPorAgenda(scheduleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/findAllForSchedule?idSchedule=${scheduleId}`);//trae todos los turnos
  }

  obtenerTurnosLlenarTabla(scheduleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/fillTurns?idSchedule=${scheduleId}`);
  }

  obtenerTurnosReservados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/findAssignTurns`);//trae todos los turnos ya reservados
  }

  obtenerTurnosDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/findNotAssignTurns`);//trae todos los turnos no reservados
  }

  obtenerTurnosReservadosPorAgenda(scheduleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/findAssignTurnsForSchedule?scheduleId=${scheduleId}`);//trae todos los turnos ya reservados de una agenda
  }

  obtenerTurnosDisponiblesPorAgenda(scheduleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/findNotAssignTurnsForSchedule?scheduleId=${scheduleId}`);//trae todos los turnos no reservados de una agenda
  }

  obtenerTurnosAprobadosPorAgenda(scheduleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/findAproveTurnsForSchedule?scheduleId=${scheduleId}`);//trae todos los turnos no reservados de una agenda
  }
  obtenerTurnosDesaprobadosPorAgenda(scheduleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/findDesaproveTurnsForSchedule?scheduleId=${scheduleId}`);//trae todos los turnos no reservados de una agenda
  }

  obtenerAgenda(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/findOne?id=${id}`);
  }


  agendarTurno(id: number, toUpdate: any): Observable<any> {
    const body = { id, ...toUpdate };
    return this.http.patch<any>(`${this.baseUrl2}/assignTurn`, body).pipe(
      catchError((error) => {
        if (error.error.message === 'No se puede asignar el turno hasta que la seña esté pagada') {
          // Aquí abres el modal con el enlace a MercadoPago
        }
        throw error;
      })
    );
  }
  

  aprobarTurno(id: number): Observable<any> {
    const body = { id };
    return this.http.patch<any>(`${this.baseUrl2}/aproveTurn`, body).pipe();
  }

  desaprobarTurno(id: number): Observable<any> {
    const body = { id };
    return this.http.patch<any>(`${this.baseUrl2}/desaproveTurn`, body).pipe();
  }
  
  cancelarTurno(id: number, toUpdate: any): Observable<any> {//Reservar un turno a un cliente
    const body = { id, ...toUpdate };
    return this.http.patch<any>(`${this.baseUrl2}/unAssignTurn`, body);
  }
}


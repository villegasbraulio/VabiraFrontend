import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private baseUrl = 'http://localhost:3000/api/schedule';
  private baseUrl2 = 'http://localhost:3000/api/turn';

  constructor(private http: HttpClient) { }

  obtenerAgendas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/findAll`);
  }

  obtenerTurnos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/findAll`);
  }

  obtenerTurnosReservados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/findAssignTurns`);
  }

  obtenerTurnosDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl2}/findNotAssignTurns`);
  }

  obtenerAgenda(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/findOne?id=${id}`);
  }

  agendarTurno(id: number, toUpdate: any): Observable<any> {
    const body = { id, ...toUpdate };
    return this.http.patch<any>(`${this.baseUrl2}/assignTurn`, body).pipe(
      tap(() => {
        // Actualizar el estado del botón después de realizar la reserva con éxito
        const buttonId = `${toUpdate.classDayType}-${toUpdate.startTime}-${toUpdate.endTime}`;
        const buttonElement = document.getElementById(buttonId) as HTMLButtonElement;
        if (buttonElement) {
          buttonElement.innerText = 'Reservado';
          buttonElement.classList.add('reserved-button');
          buttonElement.disabled = true; // Deshabilitar el botón
        }
      })
    );
  }
  
}


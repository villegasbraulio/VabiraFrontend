import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TurneroService {
  private apiUrl = 'http://localhost:3000/api/schedule'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) {}

  createSchedule(scheduleData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, scheduleData);
  }

  eliminarAgenda(id: number): Observable<any> {
    // Crea un objeto con el ID a eliminar
    const body = { id: id };
    // Realiza una solicitud PATCH con el cuerpo (body) que contiene el ID
    return this.http.patch<any>(`${this.apiUrl}/delete`, body);
  }

}

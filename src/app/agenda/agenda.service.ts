import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  obtenerAgenda(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/findOne?id=${id}`);
  }

  // Corrige el nombre de la función a agendarTurno y utiliza la URL baseUrl2
  agendarTurno(id: number, toUpdate: any): Observable<any> {
    const body = { id, ...toUpdate };
    return this.http.patch<any>(`${this.baseUrl2}/assignTurn`, body);
  }
}


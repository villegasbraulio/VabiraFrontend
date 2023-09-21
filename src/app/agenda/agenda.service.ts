import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private baseUrl = 'http://localhost:3000/api/schedule';

  constructor(private http: HttpClient) { }

  obtenerAgendas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/findAll`);
  }

  obtenerAgenda(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/findOne?id=${id}`);
  }

}

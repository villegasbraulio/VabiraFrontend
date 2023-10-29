import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'http://localhost:3000/api/turn/findAssignTurns'; // URL de la API, ajusta según tu configuración

  constructor(private http: HttpClient) { }

  getReportes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

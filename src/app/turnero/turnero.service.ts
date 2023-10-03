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
}

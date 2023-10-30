import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private agendasUrl = 'http://localhost:3000/api/schedule/findAll';
  private apiUrl = 'http://localhost:3000/api/turn/findAssignTurnsForSchedule?scheduleId=';

  constructor(private http: HttpClient) { }

  getReportes(): Observable<any[]> {
    // Hacer el request para obtener la lista de agendas
    return this.http.get<any[]>(this.agendasUrl).pipe(
      mergeMap(agendas => {
        // Utilizar 'forkJoin' para combinar múltiples solicitudes en un solo observable
        const requests: Observable<any>[] = agendas.map(agenda => {
          const agendaId = agenda.id;
          const url = this.apiUrl + agendaId;
          // Hacer el request para obtener la cantidad de turnos reservados para esta agenda
          return this.http.get<any[]>(url).pipe(
            map(turnos => ({
              agendaId: agendaId,
              nombre: agenda.name,
              cantidadTurnos: turnos.length
            }))
          );
        });
        // Combinar todas las solicitudes en un solo observable usando forkJoin
        return forkJoin(requests);
      })
    );
  }
}

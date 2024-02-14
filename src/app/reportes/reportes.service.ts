import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private agendasUrl = 'http://localhost:3000/api/schedule/findAll';
  private apiUrl = 'http://localhost:3000/api/turn/findAssignTurnsForSchedule?scheduleId=';
  private userUrl = 'http://localhost:3000/api/users/all'
  private token = localStorage.getItem('token'); // Variable para almacenar el token
  private supplierSchedulesUrl = 'http://localhost:3000/api/schedule/findAllForSupplier?Id=';
  private supplierTurnsUrl = 'http://localhost:3000/api/turn/fillTurns?idSchedule=';
  private supplierTurnsUrl2 = 'http://localhost:3000/api/turn/findAllForSchedule?idSchedule='
  private purchaseurl = 'http://localhost:3000/api/purchaseRecord/all'

  constructor(private http: HttpClient) { }

  getReportes(username: string, minDate?: Date, maxDate?: Date): Observable<any[]> {
    // Hacer el request para obtener la lista de agendas
    return this.http.get<any[]>(this.agendasUrl).pipe(
      map(agendas => agendas.filter(agenda => agenda.supplier !== null)), // Filtrar agendas con supplier no nulo
      mergeMap(agendas => {
  
        agendas = agendas.filter(agenda => agenda.supplier.user.username === username);
  
        // Utilizar 'forkJoin' para combinar múltiples solicitudes en un solo observable
        const requests: Observable<any>[] = agendas.map(agenda => {
          const agendaId = agenda.id;
          const url = this.apiUrl + agendaId;
          // Hacer el request para obtener los turnos para esta agenda
          return this.http.get<any[]>(url).pipe(
            map(turnos => {
              // Filtrar los turnos dentro del rango de fechas especificado
              if (minDate && maxDate) {
                turnos = turnos.filter(turno => {
                  const turnoDate = new Date(turno.dateFrom);
                  return turnoDate >= minDate && turnoDate <= maxDate;
                });
              }
              return {
                agendaId: agendaId,
                nombre: agenda.name,
                cantidadTurnos: turnos.length,
                username: agenda.supplier.user.username
              };
            })
          );
        });
        // Combinar todas las solicitudes en un solo observable usando forkJoin
        return forkJoin(requests);
      })
    );
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });
    return headers;
  }


  getUsersCountByRole(): Observable<any[]> {
    const httpOptions = {
      headers: this.getHeaders(), // Obtener las cabeceras con el token
    };
    console.log(httpOptions);
    return this.http.get<any[]>(this.userUrl, httpOptions).pipe(
      map(users => {
        // Filtrar usuarios con id no nulo
        const filteredUsers = users.filter(user => user.id !== null);

        // Contar usuarios por combinación de roles
        const roleCounts = filteredUsers.reduce((acc, user) => {
          const roles = user.roles.split(','); // Suponiendo que los roles están separados por coma en la respuesta del servidor
          roles.forEach((role: string | number) => {
            acc[role] = (acc[role] || 0) + 1;
          });
          return acc;
        }, {});

        // Convertir el objeto de conteo a un array de objetos
        const result = Object.keys(roleCounts).map(role => ({
          role: role,
          count: roleCounts[role]
        }));

        return result;
      }
      )
    )
  }
    
  // Nuevo método para obtener las agendas del proveedor
  getSupplierSchedules(userid: string): Observable<any[]> {
    return this.http.get<any[]>(this.supplierSchedulesUrl );
  }

  // Nuevo método para obtener los datos de turnos del proveedor
  getSupplierTurns(scheduleId: number): Observable<any> {
    return this.http.get<any>(this.supplierTurnsUrl + scheduleId);
  }

  getSupplierTurns2(scheduleId: number): Observable<any> {
    return this.http.get<any>(this.supplierTurnsUrl2 + scheduleId);
  }


  getExcelDataBySchedule(scheduleId: number): Observable<any> {
    const url = `http://localhost:3000/api/turn/fillTurns?idSchedule=${scheduleId}`;
    return this.http.get<any>(url);
  }

  //Obtener todas las ventas

  getVentas (){
    const url = `http://localhost:3000/api/saleRecord/all`;
    return this.http.get<any>(url);
  }

  getCompras () {
    return this.http.get<any>(this.purchaseurl);
  }


}

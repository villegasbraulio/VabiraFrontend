import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private apiUrl = 'http://localhost:3000/api/alerts/alertForClient'; // Reemplaza esto con la URL correcta de tu API
  private apiUrl2 = 'http://localhost:3000/api/alerts/alertForSupplier'; // Reemplaza esto con la URL correcta de tu API
  private supplierUrl = 'http://localhost:3000/api/supplier/all'

  constructor(private http: HttpClient) { }

  getAlertsClient(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?id=${id}`);
  }

  getAlertsSupplier(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl2}?id=${id}`);
  }

  getSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(this.supplierUrl)
  }

}

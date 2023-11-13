import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private apiUrl = 'http://localhost:3000/api/alerts'; // Reemplaza esto con la URL correcta de tu API
  private supplierUrl = 'http://localhost:3000/api/supplier/all'

  constructor(private http: HttpClient) { }

  getAlerts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(this.supplierUrl)
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })

  export class ClienteService {
  private baseUrl = 'http://localhost:3000/api/client'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  obtenerClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  obtenerCliente(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/findOne?id=${id}`);
  }

  obtenerClienteUserId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/findOneUserId?id=${id}`);
  }

  eliminarCliente(id: number): Observable<any> {
    // Crea un objeto con el ID a eliminar
    const body = { id: id };
    // Realiza una solicitud POST con el cuerpo (body) que contiene el ID
    return this.http.patch<any>(`${this.baseUrl}/delete`, body);
  }

  editarCliente(id: number, toUpdate:any): Observable<any> {
    // Crea un objeto con el ID a eliminar
    const body = { id: id, ...toUpdate };
    // Realiza una solicitud POST con el cuerpo (body) que contiene el ID
    return this.http.patch<any>(`${this.baseUrl}/update`, body);
  }
}
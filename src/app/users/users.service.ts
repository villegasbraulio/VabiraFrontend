import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  obtenerUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/findOne?id=${id}`);
  }

  // Implementa otros métodos para crear, editar y eliminar usuarios según tus necesidades
}

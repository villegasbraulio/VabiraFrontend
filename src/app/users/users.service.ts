import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users'; // Reemplaza con la URL de tu backend
  private profileUrl = 'http://localhost:3000/api/auth'; // Reemplaza con la URL de tu endpoint para el perfil del usuario
  private token: string; // Obtén el token desde localStorage u otra fuente

  constructor(private http: HttpClient) {
    // Obtén el token desde localStorage u otra fuente y almacénalo en la propiedad token
    this.token = localStorage.getItem('token') ?? ''  }
  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  obtenerUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/findOne?id=${id}`);
  }

  eliminarUsuario(id: number): Observable<any> {
    // Crea un objeto con el ID a eliminar
    const body = { id: id };
    // Realiza una solicitud POST con el cuerpo (body) que contiene el ID
    return this.http.patch<any>(`${this.baseUrl}/delete`, body);
  }

  editarUsuario(id: number, toUpdate:any): Observable<any> {
    // Crea un objeto con el ID a eliminar
    const body = { id: id, ...toUpdate };
    // Realiza una solicitud POST con el cuerpo (body) que contiene el ID
    return this.http.patch<any>(`${this.baseUrl}/update`, body);
  }

  // Implementa otros métodos para crear, editar y eliminar usuarios según tus necesidades

// Método para obtener el perfil del usuario
obtenerPerfilUsuario(): Observable<any> {
  // Asegúrate de tener el token disponible
  if (this.token) {
    // Configura los encabezados con el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    // Realiza la solicitud al endpoint con los encabezados configurados
    return this.http.get<any>(`${this.profileUrl}/check-status`, { headers });
  } else {
    // Si no hay token disponible, puedes manejar el error de alguna manera
    // por ejemplo, redirigiendo al usuario a la página de inicio de sesión.
    // También puedes devolver un observable que emita un objeto de error.
    return new Observable(); // Devuelve un observable vacío o maneja el error según tu caso.
  }
}
  //agregue esto para obtener los datos del usuario activo
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users'; // Reemplaza con la URL de tu backend
  private baseUrl2 = 'http://localhost:3000/api/auth'; // Reemplaza con la URL de tu backend
  private token = localStorage.getItem('token'); // Variable para almacenar el token
  private email = localStorage.getItem('email')

  constructor(private http: HttpClient) { }


  setToken(token: string | null) {
    this.token = token;
  }

  setEmail(email: string | null) {
    this.email = email;
  }

  // Método para obtener las cabeceras HTTP con el token
   getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });
    return headers;
  }

  obtenerUsuarios(): Observable<any[]> {
    const httpOptions = {
      headers: this.getHeaders(), // Obtener las cabeceras con el token
    };
    console.log(httpOptions);
    
    return this.http.get<any[]>(`${this.baseUrl}/all`, httpOptions);
  }

  obtenerUsuario(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getHeaders(), // Obtener las cabeceras con el token
    };
    
    return this.http.get<any>(`${this.baseUrl}/findOne?id=${id}`, httpOptions);
  }

  obtenerPerfil(): Observable<any> {
    const httpOptions = {
      headers: this.getHeaders(), // Obtener las cabeceras con el token
    };
    
    return this.http.get<any>(`${this.baseUrl}/findOneEmail?email=${this.email}`, httpOptions)
    .pipe(tap((clientFound)=> {return clientFound}));
  }

  eliminarUsuario(id: number): Observable<any> {
    // Crea un objeto con el ID a eliminar
    const body = { id: id };
    const httpOptions = {
      headers: this.getHeaders(), // Obtener las cabeceras con el token
    };
    
    // Realiza una solicitud PATCH con el cuerpo (body) que contiene el ID
    return this.http.patch<any>(`${this.baseUrl}/delete`, body, httpOptions);
  }

  editarUsuario(id: number, toUpdate: any): Observable<any> {
    // Crea un objeto con el ID a eliminar
    const body = { id: id, ...toUpdate };
    const httpOptions = {
      headers: this.getHeaders(), // Obtener las cabeceras con el token
    };
    
    
    // Realiza una solicitud PATCH con el cuerpo (body) que contiene el ID
    return this.http.patch<any>(`${this.baseUrl}/update`, body, httpOptions);
  }

  verificarToken(): Observable<boolean> {
    const token = localStorage.getItem('token');
    console.log(token);
    

    if (!token) {
      // Si no hay token en el almacenamiento local, el usuario no está autenticado
      return of(false);
    }

    // Realiza una solicitud al servidor para verificar la validez del token
    return this.http.post<boolean>(`${this.baseUrl2}/verify-token`, { token });
  }

  // Implementa otros métodos para crear, editar y eliminar usuarios según tus necesidades
}

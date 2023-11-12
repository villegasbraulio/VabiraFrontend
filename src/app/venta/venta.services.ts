import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Venta } from "./venta";

@Injectable({

    providedIn: 'root'
})
export class VentaService {
    private url = 'http://localhost:3000/api/saleRecord';
    constructor(private http: HttpClient) {

    }
    getVenta(): Observable<any> {
        return this.http.get(this.url);
    }

    obtenerVentas(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/all`);
    }

    descargarPDF(id: number): Observable<Blob> {
        const url = `${this.url}/downloadPDF?id=${id}`;
        return this.http.get(url, { responseType: 'blob' });
    }

    //Para eliminar una venta
    eliminarVenta(id: number): Observable<any> {
        // Crea un objeto con el ID a eliminar
        const body = { id: id };
        // Realiza una solicitud PATCH con el cuerpo (body) que contiene el ID
        return this.http.patch<any>(`${this.url}/delete`, body);
    }

    // Para crear una venta
    guardarVenta(venta: any): Observable<any> {
        return this.http.post(`${this.url}/create`, venta);
    }

    // Para editar una venta
    obtenerVenta(id: string): Observable<any> {
        return this.http.get(this.url + id);
    }
    // editar
    editarVenta(id: string, venta: Venta): Observable<any> {
        return this.http.put(this.url + id, venta);
    }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Venta } from "./venta";

@Injectable({
   
    providedIn: 'root'
})
export class VentaService{
    //url: 'http://localhost: 3000/api/venta/';
    url: string = 'http://localhost: 3000/api/venta/';
    constructor(private http: HttpClient){

    }
    getVenta(): Observable <any>{
    return this.http.get(this.url);
    }
    //Para eliminar una venta
    eliminarVenta(id: string): Observable <any> {
         return this.http.delete(this.url + id);
    }
    // Para crear una venta
    guardarVenta(venta: Venta): Observable <any>{
        return this.http.post(this.url, venta);
    }
    // Para editar una venta
    obtenerVenta(id: string): Observable <any>{
        return this.http.get(this.url + id);
    }
    // editar
    editarVenta(id: string, venta: Venta): Observable <any>{
        return this.http.put(this.url + id, venta);
    }
}
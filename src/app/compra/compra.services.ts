import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Compra } from "./compra";
@Injectable({
    providedIn: 'root'
})
export class CompraService{
    //url: 'http://localhost: 3000/api/compra/';
    url: string = 'http://localhost: 3000/api/compra/';
    constructor(private http: HttpClient){

    }
    getCompra(): Observable<any>{
    return this.http.get(this.url);
    }
    //Para eliminar un registro de compra
    eliminarCompra(id: string): Observable<any> {
         return this.http.delete(this.url + id);
    }
    // Para crear un registro de compra
    guardarCompra(compra: Compra): Observable<any>{
        return this.http.post(this.url, compra);
    }
    // Para editar un registro de compra
    obtenerCompra(id: string): Observable <any>{
        return this.http.get(this.url + id);
    }
    // editar un registro de compra
    editarCompra(id: string, compra: Compra): Observable<any>{
        return this.http.put(this.url + id, compra);
    }
}
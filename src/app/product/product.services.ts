import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Producto } from "./producto";
@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private url = 'http://localhost:3000/api/product';
    constructor(private http: HttpClient) {

    }
    getProduct(): Observable<any> {
        return this.http.get(this.url);
    }

    getProducts(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/all`);
    }

    getProducts2(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/all2`);
    }

    //Para eliminar un producto
    eliminarProducto(id: number): Observable<any> {
        // Crea un objeto con el ID a eliminar
        const body = { id: id };
        // Realiza una solicitud PATCH con el cuerpo (body) que contiene el ID
        return this.http.patch<any>(`${this.url}/delete`, body);
      }
    // Para crear un producto
    guardarProducto(product: any): Observable<any> {
        return this.http.post(`${this.url}/create`, product);
    }
    // Para editar un producto
    obtenerProducto(id: string): Observable<any> {
        return this.http.get(this.url + id);
    }
    // editar
    editarProducto(id: number, toUpdate: any): Observable<any> {
        const body = {id: id, ...toUpdate}
        return this.http.patch<any>(`${this.url}/update`, body);
    }
}
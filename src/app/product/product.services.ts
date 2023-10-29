import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Producto } from "./producto";
@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private url = 'http://localhost:3000/api/product/';
    constructor(private http: HttpClient) {

    }
    getProduct(): Observable<any> {
        return this.http.get(this.url);
    }

    obtenerProductos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/all`);
    }

    //Para eliminar un producto
    eliminarProducto(id: string): Observable<any> {
        return this.http.delete(this.url + id);
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
    editarProducto(id: string, producto: Producto): Observable<any> {
        return this.http.put(this.url + id, producto);
    }
}
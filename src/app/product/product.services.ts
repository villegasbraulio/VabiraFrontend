import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Producto } from "./producto";
@Injectable({
    providedIn: 'root'
})
export class ProductService{
    //url: 'http://localhost: 3000/api/product/';
    url: string = 'http://localhost: 3000/api/product/';
    constructor(private http: HttpClient){

    }
    getProduct(): Observable<any>{
    return this.http.get(this.url);
    }
    //Para eliminar un producto
    eliminarProducto(id: string): Observable<any> {
         return this.http.delete(this.url + id);
    }
    // Para crear un producto
    guardarProducto(producto: Producto): Observable<any>{
        return this.http.post(this.url, producto);
    }
    // Para editar un producto
    obtenerProducto(id: string): Observable <any>{
        return this.http.get(this.url + id);
    }
    // editar
    editarProducto(id: string, producto: Producto): Observable<any>{
        return this.http.put(this.url + id, producto);
    }
}
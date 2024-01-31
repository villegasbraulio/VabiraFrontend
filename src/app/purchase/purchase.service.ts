import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class PurchaseService {
    private url = 'http://localhost:3000/api/purchaseRecord';
    constructor(private http: HttpClient) {

    }
    getProduct(): Observable<any> {
        return this.http.get(this.url);
    }

    obtenerCompras(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/all`);
    }

    descargarPDF(id: number): Observable<Blob> {
        const url = `${this.url}/downloadPDF?id=${id}`;
        return this.http.get(url, { responseType: 'blob' });
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
}
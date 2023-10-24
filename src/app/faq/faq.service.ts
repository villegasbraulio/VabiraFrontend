import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private apiUrl = 'http://localhost:3000/api/faqs';

  constructor(private http: HttpClient) {}

  getFaqs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }    //return this.http.get<any[]>(`${this.baseUrl}/all`);


  crearFaq(faq: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, faq);
  }

  eliminarFaq(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }

  editarFaq(id: number, faq: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, faq);
  }
}

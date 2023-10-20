import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:3000/api/companies'; // Asegúrate de tener la URL correcta del API

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
 

  createCompany(company: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, company);
  }

  // updateCompany(id: number, company: Company): Observable<Company> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.put<Company>(url, company);
  // }

  deleteCompany(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}

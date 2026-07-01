import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MarketingService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCustomers(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/crm/customers?supplierId=${supplierId}`, this.httpOptions());
  }

  getTemplates(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/message-templates?supplierId=${supplierId}`, this.httpOptions());
  }

  getMessageLogs(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/automation/message-logs?supplierId=${supplierId}`, this.httpOptions());
  }

  getScheduled(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/automation/scheduled?supplierId=${supplierId}`, this.httpOptions());
  }

  private httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    };
  }
}

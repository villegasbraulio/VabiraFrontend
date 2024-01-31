import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap,  } from 'rxjs';
import { IRequestCode } from '../interfaces/requestCode.interface';

export interface LoginResponseData {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private tokenExpirationTimer: any;

  localhost: string = 'http://localhost:3000/api/';

  constructor(private http: HttpClient, private router: Router) {}

  requestCode(email: string) {
    return this.http
      .post<IRequestCode>(this.localhost + 'auth/sendEmail', {
        email: email,
      })
      .pipe(
        tap((resData: IRequestCode) => {
          return resData;
        })
      );
  }

}

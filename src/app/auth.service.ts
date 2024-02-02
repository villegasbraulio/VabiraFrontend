import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
// import jwt_decode from 'jwt-decode';
import { IRequestCode } from './interfaces/requestCode.interface';
import { ILoginResponseUser } from './shared/interfaces/user-response-login.interface';

export interface LoginResponseData {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<ILoginResponseUser | null>(null);


  private tokenExpirationTimer: any;

  localhost: string = 'http://localhost:3000/api/';

  constructor(private http: HttpClient, private router: Router) {}


  requestCode(email: string) {
    return this.http
      .post<IRequestCode>(this.localhost + 'auth/sendEmail', {
        email: email,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData: IRequestCode) => {
          return resData;
        })
      );
  }

  restorePassword(email: string, password: string) {
    return this.http
      .post<void>(
        `${this.localhost}auth/restorePassword?email=${email}&password=${password}&validationCode=true`,
        {}
      )
      .pipe(catchError(this.handleError));
  }


  get token() {
    const strToken = localStorage.getItem('token');
    if (strToken === null) return;
    return JSON.parse(strToken);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let detail: string = 'Ha ocurrido un error!';
    switch (errorRes.status) {
      case 404:
        detail = 'Usuario no encontrado';
        break;
      case 403:
        detail = 'La contraseña es incorrecta';
        break;
    }
    console.log(errorRes);

    let errorMessage: Message = {
      severity: 'error',
      summary: 'Error',
      detail: detail,
    };
    return throwError(() => errorMessage);
  }

//   private getExpiryTime(token: string) {
//     const decodedToken: { [key: string]: string } = jwt_decode(token);
//     console.log(decodedToken['exp']);

//     return decodedToken['exp'];
//   }

//   private isTokenExpired(token: string) {
//     const expiryTime: string | null = this.getExpiryTime(token);
//     return 1000 * +expiryTime - new Date().getTime() < 5000;
//   }
}
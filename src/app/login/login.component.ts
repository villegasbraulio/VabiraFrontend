import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  errorMessage: string = ''; // Variable para almacenar el mensaje de error

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const loginData = { username: this.username, email: this.email, password: this.password };

    this.http.post('http://localhost:3000/api/auth/login', loginData).subscribe(
      (response: any) => {
        // Maneja la respuesta del servidor aquí
        console.log('Respuesta del servidor:', response);

        // Puedes hacer algo con el token devuelto, como guardar en localStorage
        const token = response.token;
        localStorage.setItem('token', token);

        // Limpiar el mensaje de error en caso de éxito
        this.errorMessage = '';
        this.router.navigate(['principal']);
      },
      (error) => {
        // Maneja los errores aquí
        console.error('Error:', error);

        // Establecer el mensaje de error basado en la respuesta del servidor o personalizado
        this.errorMessage = 'Credenciales incorrectas. Por favor, verifica tu username, correo electrónico y/o contraseña.';
      }
    );
  }
}

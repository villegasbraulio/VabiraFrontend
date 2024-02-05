import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../users/users.service';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService // Inyecta MessageService
  ) {}
  

  onSubmit() {
    const loginData = { username: this.username, email: this.email, password: this.password };
  
    this.http.post('http://localhost:3000/api/auth/login', loginData).subscribe(
      (response: any) => {
        // ...
        console.log('response: ', response);
        
        // Puedes hacer algo con el token devuelto, como guardar en localStorage
        const token = response.token;
        const email = response.user.email;
        const roles: any = response.user.roles
        this.userService.setToken(token);
        this.userService.setEmail(email);
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        // Verificar el token y redirigir al usuario si es válido
        this.userService.verificarToken().subscribe((isAuthenticated) => {
          if (isAuthenticated) {
              if(roles.includes('admin')){
                this.router.navigate(['/principal']);
              } else {
                this.router.navigate(['/principal']);
              }
            // Limpiar el mensaje de error en caso de éxito
            this.messageService.clear(); // Limpia los mensajes existentes
          } else {
            // Manejar la autenticación fallida (token inválido)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La autenticación falló debido a un token inválido.' });
          }
        });
      },
      (error) => {
        // Maneja los errores aquí
        console.error('Error:', error);
        // Establecer el mensaje de error basado en la respuesta del servidor o personalizado
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Credenciales incorrectas. Por favor, verifica tu username, correo electrónico y/o contraseña.' });
      }
    );
  }
}  
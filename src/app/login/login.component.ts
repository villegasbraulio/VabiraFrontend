import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Asegúrate de que esta línea apunte al archivo CSS que has creado.
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  onSubmit() {
    // Aquí puedes agregar la lógica para enviar la información de inicio de sesión al backend (Next.js).
    // Puedes usar servicios HTTP de Angular para esto.
    // Por ejemplo:
    // this.authService.login(this.username, this.password).subscribe(response => {
    //   // Manejar la respuesta del servidor aquí.
    // });
  }
}
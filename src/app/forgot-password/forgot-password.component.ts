import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';

  onSubmit() {
    // Esta función se llama cuando el formulario se envía.
    // Puedes agregar la lógica aquí para enviar el correo de recuperación.
  }
}

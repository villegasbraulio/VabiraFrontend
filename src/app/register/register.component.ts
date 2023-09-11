import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Router } from '@angular/router'; // Importa el Router de Angular

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  dni: string = '';
  dateOfBirth: string = '';
  password: string = '';
  email: string = '';
  errorMessage: string = ''; // Variable para almacenar el mensaje de error

  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router) {}

  onSubmit() {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      dni: this.dni,
      dateOfBirth: this.dateOfBirth
    };

    this.http.post('http://localhost:3000/api/users/create', userData).subscribe(
      (response: any) => {
        // Maneja la respuesta del servidor aquí
        console.log('Respuesta del servidor:', response);

        // Puedes hacer algo con el token devuelto, como guardar en localStorage
        const token = response.token;
        localStorage.setItem('token', token);

        // Limpiar el mensaje de error en caso de éxito
        this.errorMessage = '';

        // Verifica si el estado de la respuesta es 200 (éxito)
        if (response.status === 201) {
          // Redirige al usuario a la página principal
          this.router.navigate(['/']); // Cambia '/main' por la ruta de tu página principal
        } else {
          // El estado no es 200, muestra el mensaje de error en el cuadro de diálogo
          if (response.error && response.error.error) {
            this.openErrorDialog(response.error.error);
          } else {
            this.openErrorDialog('Error al cargar los datos en el formulario');
          }
        }
        
      },
      (errorResponse) => {
        console.error('Error:', errorResponse);
      
        // Independientemente del estado del error, muestra el mensaje de error en el cuadro de diálogo
        if (errorResponse.error && errorResponse.error.error) {
          this.errorMessage = errorResponse.error.error;
        } else {
          this.errorMessage = 'Se produjo un error. Por favor, verifica tus datos e inténtalo de nuevo.';
        }

        // Mostrar el cuadro de diálogo de error
        this.openErrorDialog(this.errorMessage);
      }
    );
  }

  // Función para abrir el cuadro de diálogo de error
  openErrorDialog(errorMessage: string): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '400px', // Puedes ajustar el ancho según tus necesidades
      data: { errorMessage }
    });

    dialogRef.afterClosed().subscribe(() => {
      // Cuando el cuadro de diálogo se cierra, puedes realizar acciones adicionales si es necesario
    });
  }
}

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Router } from '@angular/router';

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
  errorMessage: string = '';
  isProvider: boolean = false;
  isClient: boolean = false;
  legajo: string = '';
  cuit: string = '';
  identityNumber: string = '';
  country: string = '';
  politicalDivision: string = '';
  address: string = '';
  

  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router) {}

  onSubmit() {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      dni: this.dni,
      dateOfBirth: this.dateOfBirth,
      legajo: this.legajo,
      cuit: this.cuit,
      identityNumber: this.identityNumber,
      country: this.country,
      politicalDivision: this.politicalDivision,
      address: this.address
    };

    let apiUrl = 'http://localhost:3000/api/users/create';

    // Ajusta la URL del punto final en función del estado de los interruptores
    if (this.isProvider) {
      apiUrl = 'http://localhost:3000/api/users/createSupplier';
    } else if (this.isClient) {
      apiUrl = 'http://localhost:3000/api/users/createClient';
    }

    this.http.post(apiUrl, userData).subscribe(
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

  // Función para manejar cambios en los interruptores
  onSwitchChange(type: string) {
    if (type === 'provider') {
      // Si el switch de Proveedor se activa, desactiva el switch de Cliente
      if (this.isProvider) {
        this.isClient = false;
      }
    } else if (type === 'client') {
      // Si el switch de Cliente se activa, desactiva el switch de Proveedor
      if (this.isClient) {
        this.isProvider = false;
      }
    }
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

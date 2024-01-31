import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Message, MessageService } from 'primeng/api';
import { IRequestCode } from '../interfaces/requestCode.interface';
import { AuthService } from './register.service';

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
  identificationNumber: string = '';
  address: string = '';
  postalCode: string = '';
  isCodeValid: boolean = false;
  requestCode = false;
  code = '';

  // Define form groups and form controls for dropdowns
  form: FormGroup;
  continentControl: FormControl;
  regionControl: FormControl;
  countryControl: FormControl;
  politicalDivisionControl: FormControl;

  // Observable variables to hold dropdown data
  continents$: Observable<any[]> = new Observable<any[]>();
  regions$: Observable<any[]> = new Observable<any[]>();
  countries$: Observable<any[]> = new Observable<any[]>();
  politicalDivisions$: Observable<any[]> = new Observable<any[]>();

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private registerService: AuthService
  ) {
    // Initialize form controls
    this.continentControl = new FormControl('');
    this.regionControl = new FormControl('');
    this.countryControl = new FormControl('');
    this.politicalDivisionControl = new FormControl('');

    // Initialize form group
    this.form = this.formBuilder.group({
      username: '',
      firstName: '',
      lastName: '',
      dni: '',
      dateOfBirth: '',
      password: '',
      email: '',
      legajo: '',
      cuit: '',
      identityNumber: '',
      continent: '',
      region: '',
      country: '',
      politicalDivision: '',
      address: '',
      postalCode: '',
      code: ''
    });

    // Fetch initial data for dropdowns
    this.loadContinents();
  }

  // Function to load continent data
  loadContinents() {
    this.continents$ = this.http.get<any[]>('http://localhost:3000/api/continent/all');
  }

  // Function to load regions based on continent selection
  loadRegions(continentId: number) {
    this.regions$ = this.http.get<any[]>(`http://localhost:3000/api/region/all?id=${continentId}`);
  }

  // Function to load countries based on region selection
  loadCountries(regionId: number) {
    this.countries$ = this.http.get<any[]>(`http://localhost:3000/api/country/all?id=${regionId}`);
  }

  // Function to load political divisions based on country selection
  loadPoliticalDivisions(countryId: number) {
    this.politicalDivisions$ = this.http.get<any[]>(`http://localhost:3000/api/politicalDivision/all?id=${countryId}`);
  }

  // Handle continent selection change
  onContinentChange() {
    const continentId = this.continentControl.value;
    this.loadRegions(continentId);
  }

  // Handle region selection change
  onRegionChange() {
    const regionId = this.regionControl.value;
    this.loadCountries(regionId);
  }

  // Handle country selection change
  onCountryChange() {
    const countryId = this.countryControl.value;
    this.loadPoliticalDivisions(countryId);
  }
  

  onSubmit() {   
    let userData:any = null;

    let apiUrl = 'http://localhost:3000/api/users/create';
    if(apiUrl = 'http://localhost:3000/api/users/create'){
      userData = {
        username: this.username,
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        dni: this.dni,
        dateOfBirth: this.dateOfBirth,
        roles: ['user']
      };
    }

    // Ajusta la URL del punto final en función del estado de los interruptores
    if (this.isProvider) {
      apiUrl = 'http://localhost:3000/api/supplier/create';
      userData = {
        username: this.username,
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        dni: this.dni,
        dateOfBirth: this.dateOfBirth,
        cuit: this.cuit,
        identificationNumber: this.identificationNumber,
      };
    } else if (this.isClient) {
      apiUrl = 'http://localhost:3000/api/client/create';
      userData = {
        username: this.username,
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        dni: this.dni,
        dateOfBirth: this.dateOfBirth,
        clientAddress: [
          {
            address: {
            address: this.address,
            postalCode: this.postalCode,
            continent: {
              id: this.continentControl.value,
            },
            region: {
              id: this.regionControl.value,
            },
            country: {
              id: this.countryControl.value,
            },
            politicalDivision: {
              id: this.politicalDivisionControl.value,
            },
          }
        }
        ]
        
      };
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

  onCancel() {
    this.form.reset();
      this.router.navigate(['/register']);
  }

  onRequestCode() {
    // if (this.form.invalid) return;
    this.registerService.requestCode(this.email).subscribe({
      next: (resData: IRequestCode) => {
        localStorage.setItem('verificationCode', '' + resData.code);
        this.requestCode = true;
      },
      error: (errorMessage: Message) => {
        this.messageService.add(errorMessage);
      },
    });
  }

  onVerifyCode() {
    const strToken = localStorage.getItem('verificationCode');
    const registerFormValue: string = this.code; // Obtener el valor del código de verificación
  
    if (strToken == registerFormValue) {
      this.isCodeValid = true;
    } else {
      let errorMessage: Message = {
        severity: 'error',
        summary: 'Error',
        detail: 'El código de verificación no es válido.',
      };
      this.messageService.add(errorMessage);
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

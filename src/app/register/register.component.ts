import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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

  // Define form groups and form controls for dropdowns
  userForm: FormGroup;
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
    private formBuilder: FormBuilder
  ) {
    // Initialize form controls
    this.continentControl = new FormControl('');
    this.regionControl = new FormControl('');
    this.countryControl = new FormControl('');
    this.politicalDivisionControl = new FormControl('');

    // Initialize form group
    this.userForm = this.formBuilder.group({
      username: ['',
        Validators.compose([
          Validators.required,  //Requiere que el campo no esté vacío.
          Validators.minLength(6),//Requiere que el campo tenga al menos 6 caracteres.
          Validators.pattern(/^[a-zA-Z0-9_]+$/),//caracteres permitidos en el nombre de usuario
          Validators.pattern(/^[^\s]+$/) //Para evitar espacios en blanco en el nombre de usuario,
        ]),
      ],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{4,}$/)]],//solo letras y cant > a 3 caracteres
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{4,}$/)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{7,8}$'),],],
      dateOfBirth: ['', [Validators.required,
      Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/),
      this.dateOfBirthValidator,
      ],
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(8), // Mínimo 8 caracteres
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email // Verifica que sea una dirección de correo válida
      ]],
      legajo:  ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      cuit: ['', [Validators.required, Validators.pattern('^[0-9]{11}$'), // Acepta solo 11 números
        ],],
      identityNumber: '',
      continent: '',
      region: '',
      country: '',
      politicalDivision: '',
      address: '',
      postalCode: ''
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

  // Validador personalizado para verificar la validez de la fecha de nacimiento
  dateOfBirthValidator(control: { value: any; }) {
    const dateOfBirth = control.value;
    if (dateOfBirth) {
      const dateParts = dateOfBirth.split('/');
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const year = parseInt(dateParts[2], 10);

      // Verificar si la fecha es válida (puedes agregar reglas adicionales)
      if (
        day < 1 ||
        day > 31 ||
        month < 1 ||
        month > 12 ||
        year < 1900 || // Ajusta el año mínimo según tus necesidades
        year > new Date().getFullYear()
      ) {
        return { invalidDateOfBirth: true };
      }
    }

    return null;
  }



  onSubmit() {
    let userData: any = null;

    let apiUrl = 'http://localhost:3000/api/users/create';
    if (apiUrl = 'http://localhost:3000/api/users/create') {
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
        address: {
          address: this.address,
          continent: this.continentControl.value,
          region: this.regionControl.value,
          country: this.countryControl.value,
          politicalDivision: this.politicalDivisionControl.value,
        }
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

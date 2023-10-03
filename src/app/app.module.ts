import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  //modulo formularios
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PrincipalComponent } from './principal/principal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersComponent } from './users/users.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { RegisterComponent } from './register/register.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { EditarUsuarioModalComponent } from './users/editar-usuario-modal.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgendaComponent } from './agenda/agenda.component';
import { ReservarCitaComponent } from './reservar-cita/reservar-cita.component';
import { DetallesCitaComponent } from './detalles-cita/detalles-cita.component';
import { MatListModule } from '@angular/material/list'; // Importa MatListModule y otros módulos que puedas necesitar

import { MatFormFieldModule } from '@angular/material/form-field'; // Importa MatFormFieldModule
import { MatInputModule } from '@angular/material/input';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FaqComponent } from './faq/faq.component'; // Importa MatInputModule

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    EditarUsuarioModalComponent,
    SidebarComponent,
    PrincipalComponent,
    UsersComponent,
    ErrorDialogComponent,
    AgendaComponent,
    ReservarCitaComponent,
    DetallesCitaComponent,
    UserProfileComponent,
    FaqComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSnackBarModule,
    FormsModule,
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    HttpClientModule,
    MatSortModule,
    MatDialogModule,
    MatIconModule,    
    RouterModule,
    BrowserAnimationsModule,
    MatListModule,
    MatDialogModule, // Asegúrate de que MatDialogModule esté importado aquí
    MatFormFieldModule, // Agrega MatFormFieldModule aquí
    MatInputModule, // Agrega MatInputModule aquí
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

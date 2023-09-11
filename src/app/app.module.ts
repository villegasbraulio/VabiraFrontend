import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  //modulo formularios
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
    ErrorDialogComponent
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
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PrincipalComponent } from './principal/principal.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: '', component: PrincipalComponent }, // Ruta principal (página vacía)
  { path: 'dashboard', component: PrincipalComponent }, // Ruta para el Dashboard (mismo componente principal)
  { path: 'usuarios', component: UsersComponent }, // Ruta para Usuarios (mismo componente principal)
    // Otras rutas para las diferentes secciones de tu aplicación
  ];
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PrincipalComponent } from './principal/principal.component';
import { UsersComponent } from './users/users.component';
import { RegisterComponent } from './register/register.component';
import { CrearProductoComponent } from './product/crear-producto/crear-producto.component';
import { ListarProductosComponent } from './product/listar-productos/listar-productos.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { TurneroComponent } from './turnero/turnero.component';
import { ListarTurneroComponent } from './turnero/listar-turnero.component';
import { AgendaComponent } from './agenda/agenda.component';
//ventas
import { ListarVentasComponent } from './venta/listar-ventas/listar-ventas.component';
import { CrearVentaComponent } from './venta/crear-venta/crear-venta.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FaqComponent } from './faq/faq.component';
import { SettingsComponent } from './settings/settings.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ListarComprasComponent } from './purchase/listar-compras.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { CrearCompraComponent } from './purchase/crear-purchase/crear-compra.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },

  { path: '', component: LoginComponent }, // Ruta principal (página vacía)
  { path: 'principal', component: PrincipalComponent }, // Ruta para el Dashboard (mismo componente principal)
  { path: 'dashboard', component: PrincipalComponent }, // Ruta para el Dashboard (mismo componente principal)
  { path: 'usuarios', component: UsersComponent }, // Ruta para Usuarios (mismo componente principal)
  { path: 'cliente', component: ClienteComponent }, // Ruta para Usuarios (mismo componente principal)
  { path: 'proveedor', component: ProveedorComponent }, // Ruta para Usuarios (mismo componente principal)
  { path: 'perfil', component: UserProfileComponent },
  { path: 'ayuda', component: FaqComponent },
  { path: 'ajustes', component: SettingsComponent },
  
  //productos
  { path: 'crear-producto', component: CrearProductoComponent },
  { path: 'editar-producto/:id', component: CrearProductoComponent },
  { path: 'listar-producto', component: ListarProductosComponent },

  { path: 'turneros', component: TurneroComponent },
  { path: 'lista-turnero', component: ListarTurneroComponent },
  { path: 'agenda/:id', component: AgendaComponent },

  // Otras rutas para las diferentes secciones de tu aplicación
  {path: 'listar-compras', component: ListarComprasComponent},
  {path: 'listar-venta', component: ListarVentasComponent},
  {path: 'crear-venta', component: CrearVentaComponent},
  { path: 'crear-compra', component: CrearCompraComponent },
  {path: 'editar-venta', component: CrearVentaComponent},

  { path: 'reportes', component: ReportesComponent }, // Ruta para el componente de reportes
  { path: 'notificaciones', component: NotificacionesComponent},

  // esta linea va siempre al final, para q cualquier URL invalida siempre direcciona al ppio
  {path: '**', redirectTo: '', pathMatch:'full'},

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  //modulo formularios
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
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
import { CommonModule, DatePipe } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field'; // Importa MatFormFieldModule
import { MatInputModule } from '@angular/material/input';
import { TurneroComponent } from './turnero/turnero.component'; // Importa MatInputModule
import { ToastrModule } from 'ngx-toastr';
import { CrearProductoComponent } from './product/crear-producto/crear-producto.component';
import { ListarProductosComponent } from './product/listar-productos/listar-productos.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { EditarProveedorModalComponent } from './proveedor/editar-proveedor-modal.component';
import { TimeRangeModalComponent } from './time-range-modal/time-range-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListarTurneroComponent } from './turnero/listar-turnero.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { CheckboxModule } from 'primeng/checkbox';


import { CrearVentaComponent } from './venta/crear-venta/crear-venta.component';
import { ListarVentasComponent } from './venta/listar-ventas/listar-ventas.component';
import { MatListModule } from '@angular/material/list'; // Importa MatListModule y otros módulos que puedas necesitar

import { UserProfileComponent } from './user-profile/user-profile.component';
import { FaqComponent } from './faq/faq.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsModalComponent } from './settings-modal/settings-modal..component'; // Importa MatInputModule
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { AccordionModule } from 'primeng/accordion';
import { ReportesComponent } from './reportes/reportes.component';

import { ChartModule } from 'primeng/chart';
import { ClienteComponent } from './cliente/cliente.component';
import { EditarClienteModalComponent } from './cliente/editar-cliente-modal.component';
import { ListarComprasComponent } from './purchase/listar-compras.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { CrearCompraComponent } from './purchase/crear-purchase/crear-compra.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { BackupComponent } from './backup/backup.component';
import { TabViewModule } from 'primeng/tabview';
import { MercadoPagoModalComponent } from './agenda/mercadopagomodal.component';
import { PasswordRecoveryComponent } from './forgot-password/forgot-password.component';
import { AuthDirective } from './shared/directives/auth.directive';
import { EditarAccesosModalComponent } from './users/editar-accesos-modal.component';

@NgModule({

  
  declarations: [
    AppComponent,
    EditarAccesosModalComponent,
    LoginComponent,
    RegisterComponent,
    PasswordRecoveryComponent,
    EditarProveedorModalComponent,
    EditarClienteModalComponent,
    EditarUsuarioModalComponent,
    SidebarComponent,
    PrincipalComponent,
    UsersComponent,
    ErrorDialogComponent,
    AgendaComponent,
    ReservarCitaComponent,
    DetallesCitaComponent,
    TurneroComponent,
    AuthDirective,
    ProveedorComponent,
    TimeRangeModalComponent,
    ListarTurneroComponent,
    ListarComprasComponent,
    CrearProductoComponent,
    CrearCompraComponent,
    ListarProductosComponent,
    FaqComponent,
    CrearVentaComponent,
    ListarVentasComponent,
    UserProfileComponent,
    SettingsComponent,
    SettingsModalComponent,
    ReportesComponent,
    ClienteComponent,
    NotificacionesComponent,
    BackupComponent,
    MercadoPagoModalComponent
  ],
  providers: [
    MessageService,
    DatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSnackBarModule,
    FormsModule,
    NgbModule, 
    MultiSelectModule,
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
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule,
    ToastrModule.forRoot(),
    TableModule,
    CommonModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    AccordionModule,
    ChartModule,
    TabMenuModule,
    CheckboxModule,
    TabViewModule
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }


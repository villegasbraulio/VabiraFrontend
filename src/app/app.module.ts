import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';  //modulo formularios
import { RouterModule } from '@angular/router';


import { PdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CarouselResponsiveDemo } from './carousel/carousel.component';

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
import { CommonModule } from '@angular/common';

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


import { CrearVentaComponent } from './venta/crear-venta/crear-venta.component';
import { ListarVentasComponent } from './venta/listar-ventas/listar-ventas.component';
import { VisualizarVentaComponent } from './venta/visualizar-venta/visualizar-venta.component';

import { CrearCompraComponent} from './compra/crear-compra/crear-compra.component';
import { ListarComprasComponent } from './compra/listar-compras/listar-compras.component';
import { VisualizarCompraComponent } from './compra/visualizar-compra/visualizar-compra.component';


import { CarouselModule } from 'primeng/carousel';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    EditarProveedorModalComponent,
    EditarUsuarioModalComponent,
    SidebarComponent,
    PrincipalComponent,
    UsersComponent,
    ErrorDialogComponent,
    AgendaComponent,
    ReservarCitaComponent,
    DetallesCitaComponent,
    TurneroComponent,

    ProveedorComponent,
    TimeRangeModalComponent,
    ListarTurneroComponent,
  
    CrearProductoComponent,
    ListarProductosComponent,

    CrearVentaComponent,
    ListarVentasComponent,
    VisualizarVentaComponent,

    CrearCompraComponent,
    ListarComprasComponent,
    VisualizarCompraComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSnackBarModule,
    FormsModule,
    NgbModule, 
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    HttpClientModule,
    MatSortModule,
    MatDialogModule,
    MatIconModule,    
    RouterModule,
    BrowserAnimationsModule,
    MatDialogModule, // Asegúrate de que MatDialogModule esté importado aquí
    MatFormFieldModule, // Agrega MatFormFieldModule aquí
    MatInputModule, // Agrega MatInputModule aquí
    ReactiveFormsModule,
    CommonModule,
    PdfViewerModule,  // Importa el módulo PdfViewerModule
    CarouselResponsiveDemo,
    CarouselModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog para el modal
import { Router } from '@angular/router'; // Importa Router para la recarga de la página
import { ProveedorService } from './proveedor.service';
import { ProveedorModalComponent } from './proveedor-modal.component';
import { EditarProveedorModalComponent } from './editar-proveedor-modal.component';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit{
  proveedores!: MatTableDataSource<any>;
  columnas = ['id', 'nombre', 'apellido', 'numero identificador', 'cuit', 'dni', 'fecha de nacimiento',  'activo', 'acciones'];
  usuarioSeleccionado: any;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private proveedorService: ProveedorService, private dialog: MatDialog, private router: Router) {

    
   }

  ngOnInit() {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedorService.obtenerProveedores().subscribe((data: any) => {
      this.proveedores = new MatTableDataSource(data);
      this.proveedores.sort = this.sort;
    });
  }

  verProveedor(id: number) {
    // Llama al método del servicio para obtener los datos del usuario por su ID
    this.proveedorService.obtenerProveedor(id).subscribe((data: any) => {
      // Abre el modal con los datos del usuario
      const dialogRef = this.dialog.open(ProveedorModalComponent, {
        data,
        width: '70%', // Puedes ajustar este valor según tus necesidades
        height: '70%', // Puedes ajustar este valor según tus necesidades
      });
    });
  }

  eliminarProveedor(id: number) {
    // Llama al método del servicio para eliminar el usuario por su ID
    this.proveedorService.eliminarProveedor(id).subscribe((data: any) => {
      // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
      this.reloadPage(); // Recarga la página después de eliminar el usuario
    });
  }

  editarProveedor(id: number, toUpdate:any) {
    // Llama al método del servicio para eliminar el usuario por su ID
    this.proveedorService.editarProveedor(id, toUpdate).subscribe((data: any) => {
      // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
    });
  }
  

  // Método para recargar la página
  reloadPage() {
    // Utiliza la función de JavaScript para recargar la página actual
    location.reload();
  }

  abrirModalEdicion(usuario: any) {
    const dialogRef = this.dialog.open(EditarProveedorModalComponent, {
      width: '400px', // Puedes ajustar el ancho según tus necesidades
      data: { usuario } // Pasa los datos del usuario al modal
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Aquí puedes actualizar los datos del usuario en tu tabla
        const usuarioEditado = result;
        // Realiza la lógica para actualizar los datos
      }
    });
    
  }
}

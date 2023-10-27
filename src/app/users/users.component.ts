import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MatDialog } from '@angular/material/dialog';
import { EditarUsuarioModalComponent } from './editar-usuario-modal.component';
import { UserModalComponent } from './users-modal.component';
import { UserService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  @ViewChild('dt1') dataTable: Table | null = null;
  usuarios: any[] = [];
  columnas: any[];
  usuarioSeleccionado: any;

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.columnas = [
      { field: 'id', header: 'ID' },
      { field: 'user.username', header: 'Username' },
      { field: 'user.firstName', header: 'Nombre' },
      { field: 'user.lastName', header: 'Apellido' },
      { field: 'user.dni', header: 'DNI' },
      { field: 'user.dateOfBirth', header: 'Fecha de Nacimiento' },
      { field: 'user.roles', header: 'Roles' },
      { field: 'acciones', header: 'Acciones' },
    ];
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService.obtenerUsuarios().subscribe((data: any) => {
      this.usuarios = data;
    });
  }

  clearGlobalFilter() {
    if (this.dataTable) {
      this.dataTable.filter('', 'globalFilter', 'contains');
    }
  }

  filterGlobal(event: any) {
    if (this.dataTable) {
      this.dataTable.filterGlobal(event.target.value, 'contains');
    }
  }
  

  altaUsuario() {
    const dialogRef = this.dialog.open(EditarUsuarioModalComponent, {
      width: '400px', // Puedes ajustar el ancho según tus necesidades
      data: { usuario: null } // Pasa los datos del usuario al modal
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Aquí puedes agregar los datos del usuario a tu tabla
        const usuarioNuevo = result;
        // Realiza la lógica para agregar los datos
      }
    });
  }
  
  verUsuario(id: number) {
    // Llama al método del servicio para obtener los datos del usuario por su ID
    this.userService.obtenerUsuario(id).subscribe((data: any) => {
      // Abre el modal con los datos del usuario
      const dialogRef = this.dialog.open(UserModalComponent, {
        data,
        width: '70%', // Puedes ajustar este valor según tus necesidades
        height: '70%', // Puedes ajustar este valor según tus necesidades
      });
    });
  }
  
  eliminarUsuario(id: number) {
    // Llama al método del servicio para eliminar el usuario por su ID
    this.userService.eliminarUsuario(id).subscribe((data: any) => {
      // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
      this.reloadPage(); // Recarga la página después de eliminar el usuario
    });
  }
  
  editarUsuario(id: number, toUpdate:any) {
    // Llama al método del servicio para eliminar el usuario por su ID
    this.userService.editarUsuario(id, toUpdate).subscribe((data: any) => {
      // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
    });
  }
  
  clear(table: Table) {
    table.clear();
  }
  
  // Método para recargar la página
  reloadPage() {
    // Utiliza la función de JavaScript para recargar la página actual
    location.reload();
  }
  
  abrirModalEdicion(usuario: any) {
    const dialogRef = this.dialog.open(EditarUsuarioModalComponent, {
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





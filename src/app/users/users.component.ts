import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MatDialog } from '@angular/material/dialog';
import { EditarUsuarioModalComponent } from './editar-usuario-modal.component';
import { UserModalComponent } from './users-modal.component';
import { UserService } from './users.service';
import { MessageService } from 'primeng/api';
import { EditarAccesosModalComponent } from './editar-accesos-modal.component';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [MessageService] // Agrega MessageService como proveedor
})
export class UsersComponent implements OnInit {
  @ViewChild('dt1') dataTable: Table | null = null;
  usuarios: any[] = [];
  columnas: any[];
  usuarioSeleccionado: any;
  globalFilterText: string = ''; // Variable para almacenar el texto de búsqueda global
  currentDate = moment();

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private router: Router
  ) {
    this.columnas = [
      { field: 'id', header: 'ID' },
      { field: 'user.username', header: 'Username' },
      { field: 'user.firstName', header: 'Nombre' },
      { field: 'user.lastName', header: 'Apellido' },
      { field: 'user.dni', header: 'DNI' },
      { field: 'user.dateOfBirth', header: 'Fecha de Nacimiento' },
      { field: 'user.roles', header: 'Roles' },
      { field: 'user.userStatus[0].userStatusType.name', header: 'Estado' },
      { field: 'user.userStatus[0]?.dateTo', header: 'Fecha fin licencia' },
      { field: 'acciones', header: 'Acciones' },
    ];
  }

  ngOnInit() {
    this.cargarUsuarios();
    setInterval(() => {
      this.updateCurrentDate2();
    }, 1000);
  }

  // checkearEstadoInactivo() {

  // }

  cargarUsuarios() {
    this.userService.obtenerUsuarios().subscribe((data: any) => {
      this.usuarios = data;
      setInterval(() => {
        const currentUtcDate = moment.utc();
        for (const user of this.usuarios) {
          if (user.userStatus[0]?.dateTo) {
            const finalDate = moment.utc(user.userStatus[0].dateTo);
            const sameDateTime = finalDate.isSame(currentUtcDate, 'minute');
            if (sameDateTime) {
              this.userService.editarUsuarioEstado(user.id).subscribe(() => {
                window.location.reload();
              });
            }
          }
        }
      }, 60000); // Actualizar cada minuto
    });
  }
  
  

  clearGlobalFilter() {
    if (this.dataTable) {
      this.dataTable.filter('', 'global', 'contains');
      this.globalFilterText = ''; // Limpiar el texto de búsqueda global
    }
  }

  filterGlobal(event: any) {
    if (this.dataTable) {
      this.globalFilterText = event.target.value; // Almacena el texto de búsqueda global
      this.dataTable.filter(this.globalFilterText, 'global', 'contains');
    }
  }

  updateCurrentDate2() {
    this.currentDate = moment();
  }

  altaUsuario() {
    const dialogRef = this.dialog.open(EditarUsuarioModalComponent, {
      width: '400px',
      data: { usuario: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const usuarioNuevo = result;
        this.usuarios.push(usuarioNuevo);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario agregado correctamente.' });
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
    this.userService.eliminarUsuario(id).subscribe((data: any) => {
      this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente.' });
    });
  }


  editarUsuario(id: number, toUpdate: any) {
    // Llama al método del servicio para eliminar el usuario por su ID
    this.userService.editarUsuario(id, toUpdate).subscribe((data: any) => {
      // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
    });
  }

  clear(table: Table) {
    table.clear();
  }

  // Método para recargar la página
  // reloadPage() {
  //   // Utiliza la función de JavaScript para recargar la página actual
  //   location.reload();
  // }

  abrirModalEdicion(usuario: any) {
    const dialogRef = this.dialog.open(EditarUsuarioModalComponent, {
      width: '400px',
      data: { usuario },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.usuarios = this.usuarios.map(u => (u.id === result.id ? result : u));
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente.' });
        window.location.reload()
      }
    });
  }

  abrirModalEdicionAccessos(usuario: any) {
    const accesosSeleccionados = usuario.profileUser[0].profile.accessProfile ? [...usuario.profileUser[0].profile.accessProfile] : [];
    const finalAccess = [...new Set(accesosSeleccionados.map(access => access.access.code))];
    console.log('finalAccess: ', finalAccess);

    const dialogRef = this.dialog.open(EditarAccesosModalComponent, {
      width: '400px',
      data: { usuario, finalAccess },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.usuarios = this.usuarios.map(u => (u.id === result.id ? result : u));
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Accesos del usuario actualizados correctamente.' });

        // Navegar a la misma página después de cerrar el diálogo
        window.location.reload()
      }
    });
  }
}


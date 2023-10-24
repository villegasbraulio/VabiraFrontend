import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UserService } from './users.service'; // Importa tu servicio de usuario
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog para el modal
import { UserModalComponent } from './users-modal.component'; // Importa el componente del modal
import { Router } from '@angular/router'; // Importa Router para la recarga de la página
import { EditarUsuarioModalComponent } from './editar-usuario-modal.component';
import { RegisterComponent } from '../register/register.component'; // Importa el componente de registro

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css' ],
})
export class UsersComponent implements OnInit {
  usuarios!: MatTableDataSource<any>;
  columnas = ['id', 'username','nombre', 'apellido', 'email', 'dni', 'fecha de nacimiento','roles' , 'acciones'];
  usuarioSeleccionado: any;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private dialog: MatDialog, private router: Router) {

    
   }
  
 
  ngOnInit() {
    this.cargarUsuarios();
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

  cargarUsuarios() {
    this.userService.obtenerUsuarios().subscribe((data: any) => {
      this.usuarios = new MatTableDataSource(data);
      this.usuarios.sort = this.sort;
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UserService } from './users.service'; // Importa tu servicio de usuario
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog para el modal
import { UserModalComponent } from './users-modal.component'; // Importa el componente del modal

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  usuarios!: MatTableDataSource<any>;
  columnas = ['id', 'nombre', 'apellido', 'email', 'acciones'];
  usuarioSeleccionado: any;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit() {
    this.cargarUsuarios();
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


  // Implementa las funciones para crear, editar y eliminar usuarios, etc.
}

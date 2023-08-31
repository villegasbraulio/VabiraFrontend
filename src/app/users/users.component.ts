import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  // usuarios: MatTableDataSource<Usuario>;
  // columnas = ['id', 'nombre', 'apellido', 'email', 'fechaAlta', 'perfiles', 'ultimoInicio', 'acciones'];

  @ViewChild(MatSort) sort!: MatSort;

  // Funciones para cargar datos de usuarios, crear, ver, editar y eliminar usuarios, etc.

  ngOnInit() {
    // Carga los datos de los usuarios en this.usuarios
    // Configura la ordenación inicial
    // this.usuarios.sort = this.sort;
  }

  // Implementa las funciones crearUsuario, verUsuario, editarUsuario, eliminarUsuario, etc.
}

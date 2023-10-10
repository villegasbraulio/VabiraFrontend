import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../users/users.service';
import { ProveedorService } from '../proveedor/proveedor.service';

@Component({
  selector: 'app-listar-turnero',
  templateUrl: './listar-turnero.component.html',
  styleUrls: ['./listar-turnero.component.css']
})
export class ListarTurneroComponent {
  schedules!: MatTableDataSource<any>;
  columnas = ['id', 'username', 'nombre', 'apellido', 'agenda', 'acciones'];
  usuarioSeleccionado: any;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private proveedorService: ProveedorService,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService // Agrega UserService aquí
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  navigateToDashboard(scheduleId: number) {
    // Obtén el ID de la agenda y navega al componente Agenda con ese ID como parámetro
    this.router.navigate(['/agenda', scheduleId]);
  }

  cargarUsuarios() {
    this.proveedorService.obtenerProveedores2().subscribe((data: any) => {
      this.schedules = new MatTableDataSource(data);
      this.schedules.sort = this.sort;
    });
  }

  // Método para recargar la página
  reloadPage() {
    // Utiliza la función de JavaScript para recargar la página actual
    location.reload();
  }
}

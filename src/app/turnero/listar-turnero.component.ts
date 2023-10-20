// Componente TypeScript
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ProveedorService } from '../proveedor/proveedor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-turnero',
  templateUrl: './listar-turnero.component.html',
  styleUrls: ['./listar-turnero.component.css'],
})
export class ListarTurneroComponent implements OnInit {
  @ViewChild('dt1') dataTable: Table | null = null;
  schedules: any[];
  columnas: any[];

  constructor(
    private proveedorService: ProveedorService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.schedules = [];
    this.columnas = [
      { field: 'id', header: 'ID' },
      { field: 'supplier.user.username', header: 'Username' },
      { field: 'supplier.user.firstName', header: 'Nombre' },
      { field: 'supplier.user.lastName', header: 'Apellido' },
      { field: 'name', header: 'Agenda' },
      { field: 'acciones', header: 'Acciones' },
    ];
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  navigateToDashboard(scheduleId: number) {
    this.router.navigate(['/agenda', scheduleId]);
  }

  cargarUsuarios() {
    this.proveedorService.obtenerProveedores2().subscribe((data: any) => {
      this.schedules = data;
      if (this.dataTable) {
        this.dataTable.reset();
      }
    });
  }

  clearGlobalFilter() {
    if (this.dataTable) {
      this.dataTable.filter('', 'globalFilter', 'contains');
    }
  }

  filterGlobal(event: any) {
    if (this.dataTable) {
      this.dataTable.filter(event.target.value, 'globalFilter', 'contains');
    }
  }
  
  // Método para recargar la página
  reloadPage() {
    location.reload();
  }
}

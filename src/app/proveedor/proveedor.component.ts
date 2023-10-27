import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ProveedorService } from '../proveedor/proveedor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
})
export class ProveedorComponent implements OnInit {
  @ViewChild('dt1') dataTable: Table | null = null;
  proveedores: any[];
  columnas: any[];

  constructor(
    private proveedorService: ProveedorService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.proveedores = [];
    this.columnas = [
      { field: 'id', header: 'ID' },
      { field: 'supplier.user.username', header: 'Username' },
      { field: 'supplier.user.firstName', header: 'Nombre' },
      { field: 'supplier.user.lastName', header: 'Apellido' },
      { field: 'client.user.dni', header: 'DNI' },
      { field: 'supplier.cuit', header: 'CUIT' },
      { field: 'supplier.identificationNumber', header: 'Numero Identificador' },
    ];
  }

  ngOnInit() {
    this.cargarUsuarios();
  }


  cargarUsuarios() {
    this.proveedorService.obtenerProveedores().subscribe((data: any) => {
      // Verificar que data sea una matriz de objetos
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        // Verificar que los nombres de las propiedades coincidan exactamente con los campos en globalFilterFields
        const objectProperties = Object.keys(firstItem);
      }
      // Asignar datos a this.schedules después de las verificaciones
      this.proveedores = data;
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
      const filterValue = event.target.value;
      console.log('Valor del filtro:', filterValue);
      this.dataTable.filter(filterValue, 'globalFilter', 'contains');
    }
  }
  
  
  // Método para recargar la página
  reloadPage() {
    location.reload();
  }
}

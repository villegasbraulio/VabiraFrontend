import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ClienteService } from '../cliente/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  @ViewChild('dt1') dataTable: Table | null = null;
  clientes: any[];
  columnas: any[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.clientes = [];
    this.columnas = [
      { field: 'id', header: 'ID' },
      { field: 'client.user.username', header: 'Username' },
      { field: 'client.user.firstName', header: 'Nombre' },
      { field: 'client.user.lastName', header: 'Apellido' },
      { field: 'client.clientAddress.address.country.name', header: 'Pais de residencia' },
      { field: 'client.clientAddress.address.politicalDivision.name', header: 'Provincia' },
      { field: 'client.clientAddress.address.address', header: 'Direccion' },
      { field: 'client.user.dni', header: 'DNI' },
    ];
  }

  ngOnInit() {
    this.cargarUsuarios();
  }


  cargarUsuarios() {
    this.clienteService.obtenerClientes().subscribe((data: any) => {
      // Verificar que data sea una matriz de objetos
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        // Verificar que los nombres de las propiedades coincidan exactamente con los campos en globalFilterFields
        const objectProperties = Object.keys(firstItem);
      }
      // Asignar datos a this.schedules después de las verificaciones
      this.clientes = data;
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

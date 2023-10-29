import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ClienteService } from '../cliente/cliente.service';
import { Router } from '@angular/router';
import { UserService } from '../users/users.service';
import { MatDialog } from '@angular/material/dialog';
import { EditarClienteModalComponent } from './editar-cliente-modal.component';

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
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private dialog: MatDialog
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
      // { field: 'client.clientAddress.address.postalCode', header: 'Codigo Postal' },
      { field: 'client.user.dni', header: 'DNI' },
      { field: 'acciones', header: 'Acciones' },
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

  eliminarUsuario(id: number) {
    // Llama al método del servicio para eliminar el usuario por su ID
    this.userService.eliminarUsuario(id).subscribe((data: any) => {
      // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
      this.reloadPage(); // Recarga la página después de eliminar el usuario
    });
  }
  
  editarCliente(id: number, toUpdate:any) {
    // Llama al método del servicio para eliminar el usuario por su ID
    this.clienteService.editarCliente(id, toUpdate).subscribe((data: any) => {
      // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
    });
  }
  
  abrirModalEdicion(cliente: any) {
    console.log(cliente);
    
    const dialogRef = this.dialog.open(EditarClienteModalComponent, {
      width: '400px', // Puedes ajustar el ancho según tus necesidades
      data: { cliente } // Pasa los datos del usuario al modal
    });
    
    console.log(this.clientes);
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Aquí puedes actualizar los datos del usuario en tu tabla
        const clienteEditado = result;
        // Realiza la lógica para actualizar los datos
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

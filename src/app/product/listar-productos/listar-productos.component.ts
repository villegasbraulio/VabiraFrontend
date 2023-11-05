import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../product.services';

@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css']
})
export class ListarProductosComponent implements OnInit {
  @ViewChild('dt1') dataTable: Table | null = null;
  productos: any[];
  columnas: any[];

  constructor(
    private productService: ProductService,
    private router: Router,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {
    this.productos = [];
    this.columnas = [
      { field: 'id', header: 'ID' },
      { field: 'product.name', header: 'Nombre' },
      { field: 'product.brand', header: 'Marca' },
      { field: 'product.code', header: 'Codigo' },
      { field: 'product.description', header: 'Descripcion' },
      { field: 'product.prize', header: 'Precio' },
      { field: 'product.quantity', header: 'Cantidad' },
      { field: 'acciones', header: 'Acciones' },
    ];
  }

  ngOnInit() {
    this.cargarProductos();
  }


  cargarProductos() {
    this.productService.obtenerProductos().subscribe((data: any) => {
      // Verificar que data sea una matriz de objetos
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        // Verificar que los nombres de las propiedades coincidan exactamente con los campos en globalFilterFields
        const objectProperties = Object.keys(firstItem);
      }
      // Asignar datos a this.schedules después de las verificaciones
      this.productos = data;
      if (this.dataTable) {
        this.dataTable.reset();
      }
    });
  }
  
  eliminarProducto(id: number) {
    // Llama al método del servicio para eliminar el usuario por su ID
    this.productService.eliminarProducto(id).subscribe((data: any) => {
      // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
      this.reloadPage(); // Recarga la página después de eliminar el usuario
    });
  }
  
  editarProducto(id: number, toUpdate:any) {
    // Llama al método del servicio para eliminar el usuario por su ID
    this.productService.editarProducto(id, toUpdate).subscribe((data: any) => {
      // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
    });
  }
  
  // abrirModalEdicion(producto: any) {
  //   const dialogRef = this.dialog.open(EditarProductoModalComponent, {
  //     width: '400px', // Puedes ajustar el ancho según tus necesidades
  //     data: { producto } // Pasa los datos del usuario al modal
  //   });
  
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       // Aquí puedes actualizar los datos del usuario en tu tabla
  //       const productoEditado = result;
  //       // Realiza la lógica para actualizar los datos
  //     }
  //   });
  // }
  
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



import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseService } from './purchase.service';

@Component({
  selector: 'app-listar-compras',
  templateUrl: './listar-compras.component.html',
  styleUrls: ['./listar-compras.component.css']
})
export class ListarComprasComponent implements OnInit {
  @ViewChild('dt1') dataTable: Table | null = null;
  purchaseRecord: any[];
  columnas: any[];

  constructor(
    private purchaseService: PurchaseService,
    private router: Router,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {
    this.purchaseRecord = [];
    this.columnas = [
      { field: 'id', header: 'ID' },
      { field: 'purchaseRecord.product.name', header: 'Nombre de los productos' },
      { field: 'purchaseRecord.purchaseDateTime', header: 'Fecha de compra' },
      { field: 'purchaseRecord.purchaseAmount', header: 'Monto total' },
      { field: 'purchaseRecord.supplier.user.firstName', header: 'Proveedor que realizo la venta' },
      { field: 'acciones', header: 'Acciones' },
    ];
  }

  ngOnInit() {
    this.cargarCompras();
  }


  cargarCompras() {
    this.purchaseService.obtenerCompras().subscribe((data: any) => {
      // Verificar que data sea una matriz de objetos
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        // Verificar que los nombres de las propiedades coincidan exactamente con los campos en globalFilterFields
        const objectProperties = Object.keys(firstItem);
      }
      // Asignar datos a this.schedules después de las verificaciones
      this.purchaseRecord = data;
      console.log(this.purchaseRecord );
      
      if (this.dataTable) {
        this.dataTable.reset();
      }
    });
  }
  
  downloadPDF(id: number) {
    // Llamar al servicio para descargar el PDF
    this.purchaseService.descargarPDF(id).subscribe(
      (data: any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = `orden_compra_${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al descargar el PDF:', error);
      }
    );
  }
  // eliminarUsuario(id: number) {
  //   // Llama al método del servicio para eliminar el usuario por su ID
  //   this.userService.eliminarUsuario(id).subscribe((data: any) => {
  //     // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
  //     this.reloadPage(); // Recarga la página después de eliminar el usuario
  //   });
  // }
  
  // editarUsuario(id: number, toUpdate:any) {
  //   // Llama al método del servicio para eliminar el usuario por su ID
  //   this.userService.editarUsuario(id, toUpdate).subscribe((data: any) => {
  //     // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
  //   });
  // }
  
  // abrirModalEdicion(proveedor: any) {
  //   const dialogRef = this.dialog.open(EditarProveedorModalComponent, {
  //     width: '400px', // Puedes ajustar el ancho según tus necesidades
  //     data: { proveedor } // Pasa los datos del usuario al modal
  //   });
  
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       // Aquí puedes actualizar los datos del usuario en tu tabla
  //       const proveedorEditado = result;
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



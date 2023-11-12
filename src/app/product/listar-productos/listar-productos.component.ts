import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../product.services';

@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ListarProductosComponent implements OnInit {
  @ViewChild('dt1') dataTable: Table | null = null;
  productos: any[];
  productosAgrupados: any[]; 
  productosAgrupados2: any[]; 

  constructor(
    private productService: ProductService,
    private router: Router,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {
    this.productos = [];
    this.productosAgrupados = [];
    this.productosAgrupados2 = [];
  }

  ngOnInit() {
    this.cargarProductos();
    this.cargarProductos2();
  }

  cargarProductos() {
    this.productService.getProducts().subscribe((data: any) => {
      this.productosAgrupados = this.groupAndSelectLowestCode(data);
      this.productosAgrupados.forEach(producto => {
        producto.expand = false; 
      });
    });
  }

  cargarProductos2() {
    this.productService.getProducts2().subscribe((data: any) => {
      this.productosAgrupados2 = data;
      console.log('productosAgrupados2 ', this.productosAgrupados2);
    });
  }
  
  toggleExpand(producto: any) {
    producto.expand = !producto.expand;
  }

  redirectToPrincipal() {
    this.router.navigate(['/principal']);
  }
  

  eliminarProducto(id: number) {
    // Llama al método del servicio para eliminar el producto por su ID
    this.productService.eliminarProducto(id).subscribe((data: any) => {
      // Realiza acciones adicionales si es necesario
      this.reloadPage();
    });
  }

  // Agrega la lógica para agrupar por 'codeForBatch' y seleccionar el de 'code' más bajo
  groupAndSelectLowestCode(products: any[]): any[] {
    const groupedProducts: any[] = [];
    const codeForBatchSet = new Set();

    for (const product of products) {
      const codeForBatch = product.codeForBatch;

      if (!codeForBatchSet.has(codeForBatch)) {
        codeForBatchSet.add(codeForBatch);

        // Encuentra el producto con el 'code' más bajo dentro del grupo
        const lowestCodeProduct = products.reduce((lowest, p) => {
          if (p.codeForBatch === codeForBatch) {
            return p.code < lowest.code ? p : lowest;
          }
          return lowest;
        }, { code: Number.MAX_VALUE });

        groupedProducts.push(lowestCodeProduct);
      }
    }

    return groupedProducts;
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




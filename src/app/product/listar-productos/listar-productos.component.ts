import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.services';
import { Producto } from '../producto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css']
})
export class ListarProductosComponent implements OnInit {
  
  listProductos: Producto[] = [];
  constructor(private _productoService: ProductService,
              private toastr: ToastrService){}
  ngOnInit(): void {
    this.obtenerProductos();
  }


  obtenerProductos(){
    this._productoService.getProduct().subscribe(data => {
      console.log(data);
      this.listProductos = data;
    }, error => {
      console.log(error);
    })
  }
  //eliminar producto
  eliminarProducto(id: any){
    this._productoService.eliminarProducto(id).subscribe(data =>{
      this.toastr.error('el producto fue eliminado con exito', 'Producto Eliminado');
      this.obtenerProductos();
    }, error =>{
      console.log(error);
    })
  }
  
}

import { Component, OnInit } from '@angular/core';
import { CompraService } from '../compra.services';
import { Compra } from '../compra';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-compras',
  templateUrl: './listar-compras.component.html',
  styleUrls: ['./listar-compras.component.css']
})
export class ListarComprasComponent implements OnInit {
  
  listProductos: Compra[] = [];
  constructor(private _compraService: CompraService,
              private toastr: ToastrService){}
  ngOnInit(): void {
    this.obtenerCompras();
  }


  obtenerCompras(){
    this._compraService.getCompra().subscribe(data => {
      console.log(data);
      this.listCompras = data;
    }, error => {
      console.log(error);
    })
  }
  //eliminar registro de compras
  eliminarCompra(id: any){
    this._compraService.eliminarCompra(id).subscribe(data =>{
      this.toastr.error('el registro de compra fue eliminado con exito', 'Rregistro de compra Eliminado');
      this.obtenerCompras();
    }, error =>{
      console.log(error);
    })
  }
  
}





  
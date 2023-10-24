import { Component, OnInit } from '@angular/core';
import { VentaService } from '../venta.services';
import { Venta } from '../venta';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-ventas',
  templateUrl: './listar-ventas.component.html',
  styleUrls: ['./listar-ventas.component.css']
})
export class ListarVentasComponent implements OnInit {
  
  listVentas: Venta[] = [];
  constructor(private _ventaService: VentaService,
              private toastr: ToastrService){}
  ngOnInit(): void {
    this.obtenerVentas();
  }


  obtenerVentas(){
    this._ventaService.getVenta().subscribe(data => {
      console.log(data);
      this.listVentas = data;
    }, error => {
      console.log(error);
    })
  }
  //eliminar venta
  eliminarVenta(id: any){
    this._ventaService.eliminarVenta(id).subscribe(data =>{
      this.toastr.error('la venta fue eliminada con exito', 'Venta Eliminada');
      this.obtenerVentas();
    }, error =>{
      console.log(error);
    })
  }
  
}

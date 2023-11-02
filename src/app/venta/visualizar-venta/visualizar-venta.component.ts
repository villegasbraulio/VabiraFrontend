import { Component, OnInit } from '@angular/core';
import { VentaService } from '../venta.services';
import { Venta } from '../venta';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms'; // Importa FormBuilder y FormGroup

@Component({
  selector: 'app-listar-ventas',
  templateUrl: './visualizar-venta.component.html',
  styleUrls: ['./visualizar-venta.component.css'],
})
export class VisualizarVentaComponent implements OnInit {
  
  listVentas: Venta[] = [];
  id: string | null;
  
  constructor(private _ventaService: VentaService,
              private toastr: ToastrService,
              private aRouter: ActivatedRoute,
              private fb: FormBuilder) { // Inyecta FormBuilder en el constructor

    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerVentas();
  }

  obtenerVentas() {
    this._ventaService.getVenta().subscribe(data => {
      console.log(data);
      this.listVentas = data;
    }, error => {
      console.log(error);
    })
  }
}

 

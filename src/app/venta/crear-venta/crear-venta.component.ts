import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Venta } from '../venta';
import { VentaService } from '../venta.services';

@Component({
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.component.html',
  styleUrls: ['./crear-venta.component.css']
})
export class CrearVentaComponent implements OnInit {
  ventaForm: FormGroup;
  titulo='Crear venta';
  id: string | null;
  constructor(private fb: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private _ventaService: VentaService,
              private aRouter: ActivatedRoute) {
    // Inicializa el formulario en el constructor
    this.ventaForm = this.fb.group({

      // Define tus controles de formulario aquí con sus validadores
      fecha: ['', Validators.required],
      producto: ['', Validators.required],
      marca: ['', Validators.required],
      codigo: ['', Validators.required],
      precio: ['', Validators.required],
      cantidad: ['', Validators.required],
      monto_total: ['', Validators.required],
      vendedor:  ['', Validators.required],
      cliente:  ['', Validators.required],
      
    })
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }
  
  ngOnInit(): void {
  this.esEditar();
  }
  agregarVenta(){
    
    
    const VENTA: Venta ={

      fecha: this.ventaForm.get('fecha')?.value,
      producto: this.ventaForm.get('producto')?.value,
      marca: this.ventaForm.get('marca')?.value,      
      codigo: this.ventaForm.get('codigo')?.value,
      precio: this.ventaForm.get('precio')?.value,
      cantidad: this.ventaForm.get('cantidad')?.value,
      monto_total: this.ventaForm.get('monto_total')?.value,
      vendedor: this.ventaForm.get('vendedor')?.value,
      cliente: this.ventaForm.get('cliente')?.value,
      
    }

    if(this.id !== null){
      //editamos ventas
      this._ventaService.editarVenta(this.id, VENTA).subscribe(data =>{
        this.toastr.info('La venta fue actualizada con éxito','Venta Actualizada');
        this.router.navigate(['/']);
      },error =>{
        console.log(error);
        this.ventaForm.reset();
      })
    } else{
      // agregamos venta
      console.log(VENTA);
      this. _ventaService.guardarVenta(VENTA).subscribe(data =>{
        this.toastr.success('La venta fue registrada con exito!', 'Venta Registrada!');
        this.router.navigate(['/']);
      }, error =>{
        console.log(error);
        this.ventaForm.reset();
      })
      
    }
    }

   

  esEditar(){
    if(this.id !== null){
      this.titulo = 'Editar venta';
      this._ventaService.obtenerVenta(this.id).subscribe(data =>{
        this.ventaForm.setValue({
          fecha: data.fecha,
          producto: data.nombre,
          marca: data.marca,
          codigo: data.codigo,
          precio: data.precio,
          cantidad: data.cantidad,
          monto_total: data.monto_total,
          
        })
      })
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Compra } from '../compra';
import { CompraService } from '../compra.services';

@Component({
  selector: 'app-crear-compra',
  templateUrl: './crear-compra.component.html',
  styleUrls: ['./crear-compra.component.css']
})
export class CrearCompraComponent implements OnInit {
  compraForm: FormGroup;
  titulo='Crear compra';
  id: string | null;
  constructor(private fb: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private _compraService: CompraService,
              private aRouter: ActivatedRoute) {
    // Inicializa el formulario en el constructor
    this.compraForm = this.fb.group({
      // Define tus controles de formulario aquí con sus validadores
      fecha: ['', Validators.required],
      proveedor: ['', Validators.required],
      monto_total: ['', Validators.required],
      administrativo: ['', Validators.required],
      
    })
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }
  
  ngOnInit(): void {
  this.esEditar();
  }
  agregarCompra(){
 
    
    const COMPRA: Compra ={
        fecha: this.compraForm.get('fecha')?.value,
        proveedor: this.compraForm.get('proveedor')?.value,
        monto_total: this.compraForm.get('monto_total')?.value,
        administrativo: this.compraForm.get('administrativo')?.value,
        pdfId: this.compraForm.get('pdfId')?.value,
        pdfArchivo: this.compraForm.get('pdfArchivo')?.value,
      
    }

    if(this.id !== null){
      //editamos registro de compra
      this._compraService.editarCompra(this.id, COMPRA).subscribe(data =>{
        this.toastr.info('El registro de compra fue actualizado con éxito','Registro Actualizado');
        this.router.navigate(['/']);
      },error =>{
        console.log(error);
        this.compraForm.reset();
      })
    } else{
      // agregamos registro de compra
      console.log(COMPRA);
      this. _compraService.guardarCompra(COMPRA).subscribe(data =>{
        this.toastr.success('El registro de compra fue registrado con exito!', 'registro de compra Registrado!');
        this.router.navigate(['/']);
      }, error =>{
        console.log(error);
        this.compraForm.reset();
      })
      
    }
    }

  esEditar(){
    if(this.id !== null){
      this.titulo = 'Editar compra';
      this._compraService.obtenerCompra(this.id).subscribe(data =>{
        this.compraForm.setValue({
          fecha: data.fecha,
          proveedor: data.proveedor,
          monto_total: data.monto_total,
          administrativo: data.administrativo,
          pdfId: data.pdfId,
          pdfArchivo: data.pdfArchivo,
          
        })
      })
    }
  }
}

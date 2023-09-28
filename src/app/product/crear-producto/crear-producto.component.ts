import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Producto } from '../producto';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {
  productoForm: FormGroup;
  
  constructor(private fb: FormBuilder,
              private router: Router,
              private toastr: ToastrService) {
    // Inicializa el formulario en el constructor
    this.productoForm = this.fb.group({
      // Define tus controles de formulario aquí con sus validadores
      producto: ['', Validators.required],
      marca: ['', Validators.required],
      descripcion: ['', Validators.required],
      codigo: ['', Validators.required],
      precio: ['', Validators.required],
      cantidad: ['', Validators.required],
      stock_minimo: ['', Validators.required],
      fecha_caducidad: ['', Validators.required],
    });
  }
  
  ngOnInit(): void {
  
  }
  agregarProducto(){
    console.log(this.productoForm);
    console.log(this.productoForm.get('producto')?.value);
    const PRODUCTO: Producto ={
      nombre: this.productoForm.get('producto')?.value,
      marca: this.productoForm.get('marca')?.value,
      descripcion: this.productoForm.get('descripcion')?.value,
      codigo: this.productoForm.get('codigo')?.value,
      precio: this.productoForm.get('precio')?.value,
      cantidad: this.productoForm.get('cantidad')?.value,
      stock_minimo: this.productoForm.get('stock_minimo')?.value,
      fecha_caducidad: this.productoForm.get('fecha_caducidad')?.value,
    }
    console.log(PRODUCTO);
    this.toastr.success('El producto fue registrado con exito!', 'Producto Registrado!');
    this.router.navigate(['/listar-producto']);
  }

}

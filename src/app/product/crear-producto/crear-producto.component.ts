import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Producto } from '../producto';
import { ProductService } from '../product.services';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {
  productoForm: FormGroup;
  titulo='Crear producto';
  id: string | null;
  constructor(private fb: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private _productoService: ProductService,
              private aRouter: ActivatedRoute) {
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
    })
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }
  
  ngOnInit(): void {
  this.esEditar();
  }
  agregarProducto(){
    //console.log(this.productoForm);
    //console.log(this.productoForm.get('producto')?.value);
    
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

    if(this.id !== null){
      //editamos producto
      this._productoService.editarProducto(this.id, PRODUCTO).subscribe(data =>{
        this.toastr.info('El producto fue actualizado con éxito','Producto Actualizado');
        this.router.navigate(['/']);
      },error =>{
        console.log(error);
        this.productoForm.reset();
      })
    } else{
      // agregamos producto
      console.log(PRODUCTO);
      this. _productoService.guardarProducto(PRODUCTO).subscribe(data =>{
        this.toastr.success('El producto fue registrado con exito!', 'Producto Registrado!');
        this.router.navigate(['/']);
      }, error =>{
        console.log(error);
        this.productoForm.reset();
      })
      
    }
    }

   

  esEditar(){
    if(this.id !== null){
      this.titulo = 'Editar producto';
      this._productoService.obtenerProducto(this.id).subscribe(data =>{
        this.productoForm.setValue({
          producto: data.nombre,
          marca: data.marca,
          descripcion: data.descripcion,
          codigo: data.codigo,
          precio: data.precio,
          cantidad: data.cantidad,
          stock_minimo: data.stock_minimo,
          fecha_caducidad: data.fecha_caducidad,
        })
      })
    }
  }
}

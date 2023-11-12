import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Producto } from '../producto';
import { ProductService } from '../product.services';
import { Message } from 'primeng/api';
import { UserService } from 'src/app/users/users.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit{
  productoForm: FormGroup;
  messages: Message[] = [];
  supplierId: any;
  titulo = 'Crear producto';
  constructor(private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _productoService: ProductService,
    private userService: UserService,
    private aRouter: ActivatedRoute) {
    // Inicializa el formulario en el constructor
    this.productoForm = this.fb.group({
      // Define tus controles de formulario aquí con sus validadores
      name: ['', Validators.required],
      brand: ['', Validators.required],
      description: ['', Validators.required],
      code: ['', Validators.required],
      prize: ['', Validators.required],
      quantity: ['', Validators.required],
      caducityDatetime: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.userService.obtenerPerfilSupplier().subscribe(
      (data: any) => {
        this.supplierId = data;
      },
      (error) => {
        console.error('Error al obtener los datos del proveedor:', error);
      }
    ); 
  }

  agregarProducto() {
    //console.log(this.productoForm);
    //console.log(this.productoForm.get('producto')?.value);

    const PRODUCTO: Producto = {
      name: this.productoForm.get('name')?.value,
      brand: this.productoForm.get('brand')?.value,
      description: this.productoForm.get('description')?.value,
      code: this.productoForm.get('code')?.value,
      prize: this.productoForm.get('prize')?.value,
      quantity: this.productoForm.get('quantity')?.value,
      caducityDatetime: this.productoForm.get('caducityDatetime')?.value,
      supplierId: this.supplierId,
    }
    this._productoService.guardarProducto(PRODUCTO).subscribe(data => {
      this.messages = [{ severity: 'success', summary: 'Éxito', detail: 'Productos registrados con éxito' }];
      this.router.navigate(['/listar-producto']);
    }, error => {
      console.log(error);
      this.productoForm.reset();
    })


  }


}

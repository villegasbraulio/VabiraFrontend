import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/product/product.services';
import { Producto } from 'src/app/product/producto';

@Component({
  selector: 'app-crear-compra',
  templateUrl: './crear-compra.component.html',
  styleUrls: ['./crear-compra.component.css']
})
export class CrearCompraComponent implements OnInit {
  products: Producto[] = [];
  productoForm: FormGroup;
  selectedProducts: Producto[] = [];
  titulo = 'Cargar productos';

  constructor(private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _productoService: ProductService,
    private aRouter: ActivatedRoute) {
    // Inicializa el formulario en el constructor
    this.productoForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      description: ['', Validators.required],
      code: ['', Validators.required],
      prize: ['', Validators.required],
      quantity: ['', Validators.required],
      stock: ['', Validators.required],
      caducityDatetime: ['', Validators.required],
      selectedProducts: [[]], // Inicializa como un arreglo vacío
    });
  }

  ngOnInit(): void {
    // Aquí, puedes llamar a una función que obtiene los datos del backend
    this.loadDataFromBackend();
  }

  // Función para cargar datos desde el backend
  loadDataFromBackend() {
    this._productoService.getProducts().subscribe((data: Producto[]) => {
      this.products = data;
    });
  }

  agregarProducto() {
    const selectedProducts = this.productoForm.get('selectedProducts')?.value;

    const PRODUCTO: Producto = {
      name: this.productoForm.get('name')?.value,
      brand: this.productoForm.get('brand')?.value,
      description: this.productoForm.get('description')?.value,
      code: this.productoForm.get('code')?.value,
      prize: this.productoForm.get('prize')?.value,
      quantity: this.productoForm.get('quantity')?.value,
      stock: this.productoForm.get('stock')?.value,
      caducityDatetime: this.productoForm.get('caducityDatetime')?.value,
    };

    this._productoService.guardarProducto(PRODUCTO).subscribe(data => {
      this.toastr.success('El producto fue registrado con éxito!', 'Producto Registrado!');
      this.router.navigate(['/listar-compras']);
    }, error => {
      console.log(error);
      this.productoForm.reset();
    });
  }

  agregarProductos() {
    // Obtén los productos seleccionados desde el formulario
    const selectedProductIds = this.productoForm.get('selectedProducts')?.value;
    
    // Busca los productos correspondientes en la lista de productos
    this.selectedProducts = this.products.filter(product => selectedProductIds.includes(product._id));
    
    // Resto del código para guardar PRODUCTO y realizar otras acciones
    // ...
  }
}

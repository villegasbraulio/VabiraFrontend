import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Venta } from '../venta';
import { VentaService } from '../venta.services';
import { ProductService } from 'src/app/product/product.services';
import { UserService } from 'src/app/users/users.service';
import { ClienteService } from 'src/app/cliente/cliente.service';

@Component({
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.component.html',
  styleUrls: ['./crear-venta.component.css']
})
export class CrearVentaComponent implements OnInit {
  ventaForm: FormGroup;
  products: any;
  titulo = 'Crear venta';
  supplierId: any;
  client: any;
  clientFound: any;
  id: string | null;
  constructor(private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _ventaService: VentaService,
    private _productoService: ProductService,
    private clientService: ClienteService,
    private userService: UserService,
    private aRouter: ActivatedRoute) {
    // Inicializa el formulario en el constructor
    this.ventaForm = this.fb.group({
    
      // Define tus controles de formulario aquí con sus validadores
      saleDateTime: ['', Validators.required],
      quantity: ['', Validators.required],
      saleAmount: ['', Validators.required],
      client: ['', Validators.required],
      producto: [[], Validators.required]
    })
    this.clientFound = null
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    // Aquí, puedes llamar a una función que obtiene los datos del backend
    this.userService.obtenerPerfilSupplier().subscribe(
      (data: any) => {
        this.supplierId = data;
      },
      (error) => {
        console.error('Error al obtener los datos del proveedor:', error);
      }
    );

    this.clientService.obtenerClientes().subscribe(
      (data: any) => {
        this.client = data;

      },
      (error) => {
        console.error('Error al obtener los datos del cliente:', error);
      }
    );



    this._productoService.getProducts().subscribe(
      (data: any) => {
        this.products = data;

      },
      (error) => {
        console.error('Error al obtener los datos del producto:', error);
      }
    );

  }
  onClientChange() {
    const clientId = this.ventaForm.get('client')?.value;

    // Busca el cliente correspondiente en la lista de clientes
    this.clientFound = this.client.find((client: any) => client.id == clientId);
}

  agregarVenta() {

    
    const VENTA: Venta = {

      saleDateTime: this.ventaForm.get('saleDateTime')?.value,
      quantity: 0,
      saleAmount: 0,
      supplier: this.supplierId,
      product: this.ventaForm.get('producto')?.value,
      client: this.clientFound,

    }

    if (this.id !== null) {
      //editamos ventas
      this._ventaService.editarVenta(this.id, VENTA).subscribe(data => {
        this.toastr.info('La venta fue actualizada con éxito', 'Venta Actualizada');
        this.router.navigate(['/']);
      }, error => {
        console.log(error);
        this.ventaForm.reset();
      })
    } else {
      // agregamos venta
      console.log('aca? ', VENTA);
      this._ventaService.guardarVenta(VENTA).subscribe(data => {
        this.toastr.success('La venta fue registrada con exito!', 'Venta Registrada!');
        this.router.navigate(['/listar-venta']);
      }, error => {
        console.log(error);
        this.ventaForm.reset();
      })

    }
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar venta';
      this._ventaService.obtenerVenta(this.id).subscribe(data => {
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

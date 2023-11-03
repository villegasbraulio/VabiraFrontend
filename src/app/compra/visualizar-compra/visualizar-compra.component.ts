import { Component, OnInit } from '@angular/core';
import { CompraService } from '../compra.services';
import { Compra } from '../compra';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms'; // Importa FormBuilder y FormGroup




@Component({
    selector: 'app-listar-compras',
    templateUrl: './visualizar-compra.component.html',
    styleUrls: ['./visualizar-compra.component.css']
})
export class VisualizarCompraComponent implements OnInit {

    listCompras: Compra[] = [];
    //id: string | null;

    constructor(private _compraService: CompraService,
        private toastr: ToastrService,
        private aRouter: ActivatedRoute,
        private fb: FormBuilder) { // Inyecta FormBuilder en el constructor
        this.aRouter.params.subscribe(params => {
                const pdfId = params['pdfId'];
                // Aquí puedes cargar y mostrar el PDF con el ID proporcionado (pdfId).
              });
        //this.id = this.aRouter.snapshot.paramMap.get('pdfId');
    }

    ngOnInit(): void {
        this.obtenerCompras();
    }

    obtenerCompras() {
        this._compraService.getCompra().subscribe(data => {
            console.log(data);
            this.listCompras = data;
        }, error => {
            console.log(error);
        })
    }
}


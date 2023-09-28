import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-modal',
  templateUrl: './proveedor-modal.component.html',
  styleUrls: ['./proveedor-modal.component.css']
  
})
export class ProveedorModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

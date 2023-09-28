import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa MatSnackBar
import { ProveedorService } from './proveedor.service';

@Component({
  selector: 'app-editar-proveedor-modal',
  templateUrl: './editar-proveedor-modal.component.html',
  styleUrls: ['./editar-proveedor-modal.component.css']
})
export class EditarProveedorModalComponent {

  proveedor: any;

  constructor(
    public dialogRef: MatDialogRef<EditarProveedorModalComponent>,
    private proveedorService: ProveedorService,
    private snackBar: MatSnackBar, // Inyecta MatSnackBar
    @Inject(MAT_DIALOG_DATA) public data: { proveedor: any }
  ) {
    this.proveedor = { ...data.proveedor };
  }

  editarProveedor() {
    this.proveedorService.editarProveedor(this.proveedor.id, this.proveedor).subscribe((data: any) => {
      if (data.status === 200) {
        // La actualización fue exitosa, recargar la página
        location.reload();
      } else if (data.status === 400) {
        // Muestra un mensaje de error en un Snackbar
        this.snackBar.open('Error en la actualización', 'Cerrar', {
          duration: 3000, // Duración en milisegundos
        });
      }
      this.dialogRef.close(this.proveedor);
    });
  }

  cerrarModal() {
    this.dialogRef.close();
  }
}

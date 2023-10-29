import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa MatSnackBar
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-editar-cliente-modal',
  templateUrl: './editar-cliente-modal.component.html',
  styleUrls: ['./editar-cliente-modal.component.css']
})
export class EditarClienteModalComponent {

  cliente: any;

  constructor(
    public dialogRef: MatDialogRef<EditarClienteModalComponent>,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar, // Inyecta MatSnackBar
    @Inject(MAT_DIALOG_DATA) public data: { cliente: any }
  ) {
    this.cliente = { ...data.cliente };
  }

  editarCliente() {
    this.clienteService.editarCliente(this.cliente.id, this.cliente).subscribe((data: any) => {
      if (data.status === 200) {
        // La actualización fue exitosa, recargar la página
        location.reload();
      } else if (data.status === 400) {
        // Muestra un mensaje de error en un Snackbar
        this.snackBar.open('Error en la actualización', 'Cerrar', {
          duration: 3000, // Duración en milisegundos
        });
      }
      this.dialogRef.close(this.cliente);
    });
  }

  cerrarModal() {
    this.dialogRef.close();
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from './users.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa MatSnackBar
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editar-usuario-modal',
  templateUrl: './editar-usuario-modal.component.html',
  styleUrls: ['./editar-usuario-modal.component.css']
})
export class EditarUsuarioModalComponent {

  usuario: any;
  form: FormGroup;
  isOnVacation: boolean = false;
  dateTo: any

  constructor(
    public dialogRef: MatDialogRef<EditarUsuarioModalComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar, // Inyecta MatSnackBar
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: any }
  ) {
    this.usuario = { ...data.usuario };
    this.form = this.formBuilder.group({
      dateTo: '',
    });
  }

  editarUsuario() {
    
    this.userService.editarUsuario(this.usuario.id, this.usuario).subscribe((data: any) => {
      if (data.status === 200) {
        // La actualización fue exitosa, recargar la página
      } else if (data.status === 400) {
        // Muestra un mensaje de error en un Snackbar
        this.snackBar.open('Error en la actualización', 'Cerrar', {
          duration: 3000, // Duración en milisegundos
        });
      }
      this.dialogRef.close(this.usuario);
    });
  }

  onSwitchChange(type: string) {
    if (type === 'onVacation') {
      // Si el switch de Proveedor se activa, desactiva el switch de Cliente 
        this.isOnVacation = true;
    } 
  }

  cerrarModal() {
    this.dialogRef.close();
  }
}

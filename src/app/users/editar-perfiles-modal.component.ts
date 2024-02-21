import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from './users.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa MatSnackBar

@Component({
  selector: 'app-editar-usuario-modal',
  templateUrl: './editar-usuario-modal.component.html',
  styleUrls: ['./editar-usuario-modal.component.css']
})
export class EditarUsuarioModalComponent {
//es una copia del modal de usuarios, hay que camvbiar los nombres
        opciones = [
        { label: 'Turneros', value: 'turneros' },
        { label: 'Modificar turnos', value: 'modificarTurnos' },
        { label: 'Ventas', value: 'ventas' },
        { label: 'Compras', value: 'compras' },
        { label: 'Productos', value: 'productos' },
        { label: 'Agendas', value: 'agendas' },
        { label: 'Usuarios', value: 'usuarios' }
    ];

    selectedOpciones: any[] = [];

  usuario: any;

  constructor(
    public dialogRef: MatDialogRef<EditarUsuarioModalComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar, // Inyecta MatSnackBar
    @Inject(MAT_DIALOG_DATA) public data: { usuario: any }
  ) {
    this.usuario = { ...data.usuario };
  }


  guardarCambios() {
    // Implementa aquí la lógica para guardar los cambios
}
}

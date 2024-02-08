// editar-accesos-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from './users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-accessos-modal',
  templateUrl: './editar-accesos-modal.component.html',
})
export class EditarAccesosModalComponent {
  usuario: any;
  accesses: any[] = [
    { name: 'Ver Datos del Turno', key: 'VerDatosTurnos' },
    { name: 'Gestionar FAQ', key: 'GestionarFAQ' },
    { name: 'Gestionar DatosCompany', key: 'GestionarDatosCompany' },
    { name: 'Gestionar Reportes', key: 'GestionarReportes' },
    { name: 'Gestionar Usuarios', key: 'GestionarUsuarios' },
    { name: 'Gestionar Turnero', key: 'GestionarTurnero' },
    { name: 'Gestionar Productos', key: 'GestionarProductos' },
    { name: 'Gestionar Notificaciones', key: 'GestionarNotificaciones' },
    { name: 'Gestionar BackUp', key: 'GestionarBackUp' },
  ];
  selectAccess: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditarAccesosModalComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: any, finalAccess: any }
  ) {
    this.usuario = { ...data.usuario };
    this.selectAccess = data.finalAccess ? [...data.finalAccess] : [];
  }

  editarAccesos() {
    this.userService.editarUsuario2(this.usuario.id, this.selectAccess).subscribe((data: any) => {
      this.dialogRef.close(this.usuario);
    });
  }

  cerrarModal() {
    this.dialogRef.close();
  }
}


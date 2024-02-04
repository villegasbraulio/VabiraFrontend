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
    { name: 'Ver Datos del Turno', key: 'verdatosturnos' },
    { name: 'Gestionar FAQ', key: 'gestionarfaq' },
    { name: 'Gestionar DatosCompany', key: 'gestionardatoscompany' },
    { name: 'Gestionar Reportes', key: 'gestionarreportes' },
    { name: 'Gestionar Usuarios', key: 'gestionarusuarios' },
    { name: 'Gestionar Turnero', key: 'gestionarturnero' },
    { name: 'Gestionar Productos', key: 'gestionarproductos' },
    { name: 'Gestionar Notificaciones', key: 'gestionarnotificaciones' },
    { name: 'Gestionar BackUp', key: 'gestionarbackup' },
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
    console.log(this.usuario.profileUser);
    this.usuario.profileUser = this.accesses.filter(access => this.selectAccess.includes(access.key));
    
    this.userService.editarUsuario(this.usuario.id, this.usuario).subscribe((data: any) => {
      this.dialogRef.close(this.usuario);
    });
  }

  cerrarModal() {
    this.dialogRef.close();
  }
}


// //
// import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { UserService } from './users.service';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Component({
//   selector: 'app-editar-accessos-modal',
//   templateUrl: './editar-accesos-modal.component.html',
// })
// export class EditarAccesosModalComponent {
//   selectAccess: any[] = [];
//   finalAccess: string[] = [];



//   constructor(
//     public dialogRef: MatDialogRef<EditarAccesosModalComponent>,
//     private userService: UserService,
//     @Inject(MAT_DIALOG_DATA) public data: { usuario: any, finalAccess: any }
//   ) {
//     this.usuario = { ...data.usuario };
//     this.selectAccess = data.finalAccess ? [...data.finalAccess] : [];
//     console.log('Accesos: ', this.selectAccess);

//   }

//   usuario: any;

//   accesses: any[] = [
//     { name: 'Ver Datos del Turno', key: 'verdatosturnos' },
//     { name: 'Gestionar FAQ', key: 'gestionarfaq' },
//     { name: 'Gestionar DatosCompany', key: 'gestionardatoscompany' },
//     { name: 'Gestionar Reportes', key: 'gestionarreportes' },
//     { name: 'Gestionar Usuarios', key: 'gestionarusuarios' },
//     { name: 'Gestionar Turnero', key: 'gestionarturnero' },
//     { name: 'Gestionar Productos', key: 'gestionarproductos' },
//     { name: 'Gestionar Notificaciones', key: 'gestionarnotificaciones' },
//     { name: 'Gestionar BackUp', key: 'gestionarbackup' },
//   ];


//   toggleAccess(access: any) {
//     const index = this.selectAccess.indexOf(access.key);

//     if (index !== -1) {
//       this.selectAccess.splice(index, 1);
//     } else {
//       this.selectAccess.push(access.key);
//     }
//   }

//   isSelected(access: any): boolean {
//     return this.selectAccess.includes(access.key);
//   }

//   editarAccesos() {
//     // Map the selected accesses to access keys
//     const selectedAccessKeys = this.selectAccess.map(access => access.key);

//     // Update the user's profileUser with the selected access keys
//     this.usuario.profileUser = this.accesses.filter(access => selectedAccessKeys.includes(access.key));

//     // Call the service to update the user
//     this.userService.editarUsuario(this.usuario.id, this.usuario).subscribe((data: any) => {
//       this.dialogRef.close(this.usuario);
//     });
//   }

//   cerrarModal() {
//     this.dialogRef.close();
//   }
// }

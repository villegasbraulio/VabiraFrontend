import { DialogModule } from 'primeng/dialog';
import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms'; // Importa NgModel para el uso de ngModel
import { UserService } from 'src/app/users/users.service'; // Importa tu servicio de usuario
import { MessageService } from 'primeng/api'; // Importa el servicio de mensajes de PrimeNG

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [MessageService], // Agrega el servicio de mensajes como proveedor
})
export class UserProfileComponent implements OnInit {
  userProfileData: any;
  editedUserProfileData: any;
  changePasswordData: any = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };
  displayEditDialog: boolean = false;
  displayConfirmationDialog: boolean = false;
  displayChangePasswordDialog: boolean = false;

  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.userService.obtenerPerfilUsuario().subscribe((data: any) => {
      this.userProfileData = data;
      // Inicializa los datos para la edición
      this.editedUserProfileData = { ...this.userProfileData };
    });
  }

  // Método para abrir el modal de edición
  showEditDialog() {
    this.displayEditDialog = true;
  }

  // Método para guardar los cambios en el backend
  onSave() {
    this.userService.editarUsuario(this.userProfileData.id, this.editedUserProfileData).subscribe(
      (response: any) => {
        // Procesa la respuesta del backend si es necesario
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Datos actualizados correctamente' });
        this.displayEditDialog = false; // Cierra el modal después de guardar
        this.displayConfirmationDialog = true;
      },
      (error) => {
        // Maneja errores si es necesario
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar los datos' });
      }
    );
  }
  closeConfirmationDialog() {
    this.displayConfirmationDialog = false;
    // Puedes hacer otras acciones necesarias después de cerrar el diálogo, si es necesario
  }

  // Método para cancelar la edición y cerrar el modal
  cancelEdit() {
    this.displayEditDialog = false;
  }

 // Método para abrir el modal de cambio de contraseña
 showChangePasswordDialog() {
  this.displayChangePasswordDialog = true;
}

// Método para guardar los cambios de la contraseña en el backend
onChangePasswordSave() {
  // Validar la confirmación de la nueva contraseña

  if (this.changePasswordData.newPassword !== this.changePasswordData.confirmNewPassword) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden' });
    return;
  }



  // Validar que la nueva contraseña sea diferente a la contraseña actual
  if (this.changePasswordData.newPassword === this.changePasswordData.currentPassword) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La nueva contraseña debe ser diferente a la contraseña actual' });
    return;
  }





  // Enviar la solicitud al método de cambio de contraseña del servicio
  const updateData = {
    id: this.userProfileData.id,
    password: this.changePasswordData.newPassword,
    oldPassword: this.changePasswordData.currentPassword,
  };

  console.log(updateData)


  this.userService.cambiarContraseña(updateData).subscribe(
    (response: any) => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña cambiada correctamente' });
      this.displayChangePasswordDialog = false;
      // Restablecer los datos del formulario
      this.changePasswordData = {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      };
    },
    (error) => {
   
      console.error(error); // Imprime el error en la consola para depuración
    
      if (error.error.error && error.error.error === 'La contraseña antigua proporcionada no es válida') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La contraseña actual proporcionada no es válida'
        })
      }
    }
  );
}

// Método para cancelar el cambio de contraseña y cerrar el modal
cancelChangePassword() {
  this.displayChangePasswordDialog = false;
  // Restablecer los datos del formulario
  this.changePasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };
}
}


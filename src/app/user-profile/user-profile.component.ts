// user-profile.component.ts

import { Component, OnInit } from '@angular/core';
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
  displayEditDialog: boolean = false;
  displayConfirmationDialog: boolean = false;

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
}

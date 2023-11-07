import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsModalComponent } from '../settings-modal/settings-modal..component';
import { UserService } from '../users/users.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent  {
  companyName = 'Trino Spa';
  companyEmail = 'trinospa@gmail.com';
  companyPhone = '2613169089';
  companyWebsite = 'www.trinospa.com';
  companyAddress = 'Las Heras 123';
  companyDescription = 'Empresa de estetica y venta de cosmeticos';
  editing = false;
  usuario: any;
  profileTypes: string[] = [];

  constructor(private dialog: MatDialog, private userService: UserService) {
    this.usuario = null;
  }

  saveChanges() {
    // Aquí puedes agregar el código para guardar los datos editados
    this.editing = false;
  }
  ngOnInit() {
    // Llama a un método del servicio de autenticación para obtener los datos del usuario
    this.userService.obtenerPerfil().subscribe(
      (data: any) => {
        this.usuario = data; 
        const p: string[] = [];
        const roles = this.usuario.roles.split(',')  
        if (this.usuario?.roles) {   
          for (const role of roles) {
            p.push(role);         
          }       
        }         
        this.profileTypes = p;
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(SettingsModalComponent, {
      width: '500px',
      data: {
        companyName: this.companyName,
        companyEmail: this.companyEmail,
        companyPhone: this.companyPhone,
        companyWebsite: this.companyWebsite,
        companyAddress: this.companyAddress,
        companyDescription: this.companyDescription
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.companyName = result.companyName;
        this.companyEmail = result.companyEmail;
        this.companyPhone = result.companyPhone;
        this.companyWebsite = result.companyWebsite;
        this.companyAddress = result.companyAddress;
        this.companyDescription = result.companyDescription;
      }
    });
  }
}

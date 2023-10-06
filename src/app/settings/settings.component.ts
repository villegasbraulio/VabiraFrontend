import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsModalComponent } from '../settings-modal./settings-modal..component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent  {
  companyName = 'Nombre de la compañía';
  companyEmail = 'example@example.com';
  companyPhone = '1234567890';
  companyWebsite = 'www.example.com';
  companyAddress = 'Calle Falsa 123';
  companyDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  editing = false;

  constructor(private dialog: MatDialog) {}

  saveChanges() {
    // Aquí puedes agregar el código para guardar los datos editados
    this.editing = false;
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

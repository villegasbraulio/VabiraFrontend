import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsModalComponent } from '../settings-modal/settings-modal..component';

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

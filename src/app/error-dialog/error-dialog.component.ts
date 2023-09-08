import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent {

  errorMessage: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { errorMessage: string },
    public dialogRef: MatDialogRef<ErrorDialogComponent>
  ) {
    // Recibe el mensaje de error desde el componente padre
    this.errorMessage = data.errorMessage;
  }

  // Método para cerrar el cuadro de diálogo
  closeDialog(): void {
    this.dialogRef.close();
  }
}

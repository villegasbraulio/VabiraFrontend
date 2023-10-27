import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-modal',
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.css']
  
})
export class ClienteModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

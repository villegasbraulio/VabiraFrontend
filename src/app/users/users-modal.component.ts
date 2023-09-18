import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.css']
  
})
export class UserModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

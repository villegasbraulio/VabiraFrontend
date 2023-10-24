import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-modal.',
  templateUrl: './settings-modal..component.html',
  styleUrls: ['./settings-modal..component.css']
})
export class SettingsModalComponent {
  editForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SettingsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.formBuilder.group({
      companyName: [data.companyName, Validators.required],
      companyEmail: [data.companyEmail, [Validators.required, Validators.email]],
      companyPhone: [data.companyPhone, Validators.required],
      companyWebsite: [data.companyWebsite, Validators.required],
      companyAddress: [data.companyAddress, Validators.required],
      companyDescription: [data.companyDescription]
    });
  }

  onSubmit() {
    console.log('Form submitted');
    console.log(this.editForm.value);
    this.dialogRef.close(this.editForm.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}

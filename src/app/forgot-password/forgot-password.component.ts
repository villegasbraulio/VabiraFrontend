import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Message, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { matchpassword } from './match-password-validator';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [MessageService],
})
export class PasswordRecoveryComponent implements OnInit {
  emailForm: FormGroup = new FormGroup({});
  codeForm: FormGroup = new FormGroup({});
  changePasswordForm: FormGroup = new FormGroup({});
  userEmail: string = '';
  requestCode = false;
  verifyButtonEnabled = false;
  isCodeValid: boolean = false;
  changePasswordFormVisible = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(256)],
      ],
    });

    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    });

    this.changePasswordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
            ),
            Validators.minLength(8),
          ],
        ],
        repeatPassword: ['', Validators.required],
      },
      { validators: matchpassword }
    );

    this.codeForm.disable();
    this.changePasswordForm.enable()
  }

  onRequestCode() {
    if (this.emailForm.invalid) return;
    this.userEmail = this.emailForm.value.email;
    this.authService.requestCode(this.userEmail).subscribe({
      next: (_) => {
        this.requestCode = true;
        this.verifyButtonEnabled = true;
        this.codeForm.enable();
      },
      error: (errorMessage: Message) => {
        this.messageService.add(errorMessage);
      },
    });
  }

  onVerifyCode() {
    if (this.codeForm.invalid) return;
    const code = this.codeForm.get('code')?.value;

    this.authService.validatePasswordResetCode(this.userEmail, code).subscribe({
      next: ({ valid }) => {
        if (valid) {
          this.isCodeValid = true;
          this.changePasswordFormVisible = true;
          return;
        }

        let errorMessage: Message = {
          severity: 'error',
          summary: 'Error',
          detail: 'El código de verificación es inválido o venció.',
        };
        this.messageService.add(errorMessage);
      },
      error: (errorMessage: Message) => {
        this.messageService.add(errorMessage);
      },
    });
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) return;

    this.authService
      .restorePassword(
        this.userEmail,
        this.changePasswordForm.get('password')?.value,
        this.codeForm.get('code')?.value
      )
      .subscribe({
        next: (_) => {
          this.router.navigate(['/login']);
        },
        error: (errorMessage: Message) => {
          this.messageService.add(errorMessage);
        },
      });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}

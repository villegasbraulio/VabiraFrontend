import {
    Directive,
    Input,
    OnInit,
    TemplateRef,
    ViewContainerRef,
  } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ILoginResponseUser } from '../interfaces/user-response-login.interface';
import { UserService } from 'src/app/users/users.service';
  
  @Directive({
    selector: '[appAuth]',
  })
  export class AuthDirective implements OnInit {
    currentUser!: ILoginResponseUser;
    access: string[] = [];
  
    constructor(
      private templateRef: TemplateRef<any>,
      private viewContainer: ViewContainerRef,
      private authService: AuthService,
      private userService: UserService
    ) {}
  
    ngOnInit(): void {
      this.userService.obtenerPerfil().subscribe(
        (data: any) => {
          this.currentUser = data;
          this.updateView();
        },
        (error) => {
          console.error('Error al obtener los datos del usuario:', error);
        }
      );
      // this.authService.user.subscribe({
      //   next: (res: any) => {
      //     // this.currentUser = res;
      //   },
      // });
    }
  
    @Input()
    set appAuth(val: Array<string>) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.access = val;
      this.updateView();
    }
  
    private updateView(): void {
      this.viewContainer.clear();
      if (this.checkAccess()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    }
  
    private checkAccess(): boolean {
      let hasAccess: boolean = false;
      if (this.currentUser && this.currentUser.profileUser) {
        for (const a of this.access) {
          const accessFound =
            this.currentUser.profileUser[0].profile.accessProfile.find((o) => {
              return o.access.name === a;
            });
          if (accessFound) {
            hasAccess = true;
            break;
          }
        }
      }
      return hasAccess;
    }
  }
  
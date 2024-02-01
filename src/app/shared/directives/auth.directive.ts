// import {
//     Directive,
//     Input,
//     OnInit,
//     TemplateRef,
//     ViewContainerRef,
//   } from '@angular/core';
// import { AuthService } from 'src/app/auth.service';
  
//   @Directive({
//     selector: '[appAuth]',
//   })
//   export class AuthDirective implements OnInit {
//     access: string[] = [];
  
//     constructor(
//       private templateRef: TemplateRef<any>,
//       private viewContainer: ViewContainerRef,
//       private authService: AuthService
//     ) {}
  
//     ngOnInit(): void {
//       this.authService.user.subscribe({
//         next: (res: any) => {
//           this.currentUser = res;
//           this.updateView();
//         },
//       });
//     }
  
//     @Input()
//     set appAuth(val: Array<string>) {
//       this.viewContainer.createEmbeddedView(this.templateRef);
//       this.access = val;
//       this.updateView();
//     }
  
//     private updateView(): void {
//       this.viewContainer.clear();
//       if (this.checkAccess()) {
//         this.viewContainer.createEmbeddedView(this.templateRef);
//       }
//     }
  
//     private checkAccess(): boolean {
//       let hasAccess: boolean = false;
//       if (this.currentUser && this.currentUser.userProfile) {
//         for (const a of this.access) {
//           const accessFound =
//             this.currentUser.userProfile[0].profile.profileAccess.find((o) => {
//               return o.access.name === a;
//             });
//           if (accessFound) {
//             hasAccess = true;
//             break;
//           }
//         }
//       }
//       return hasAccess;
//     }
//   }
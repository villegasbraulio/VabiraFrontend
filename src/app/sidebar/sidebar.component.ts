import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../users/users.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  usuario: any;
  usuario2: any;
  quantity: any = 0;
  userName: string = '';
  userRole: string = '';
  isCollapseOpenMap: { [key: string]: boolean } = {}; // Un objeto para rastrear el estado de los colapsos.

  constructor(private router: Router, private userService: UserService, private notificacionesService: NotificacionesService) {
    this.usuario = null;
    this.usuario2 = null;
  }

  profileTypes: string[] = []; // Almacena los datos del usuario en la variable 'usuario'

  ngOnInit() {
    // Llama a un método del servicio de autenticación para obtener los datos del usuario
    this.userService.obtenerPerfil().subscribe(
      (data: any) => {
        this.usuario = data;
        const p: string[] = [];
        const roles = this.usuario.roles.split(',');
        if (this.usuario?.roles.includes('supplier')) {
          this.userService.obtenerPerfil2().subscribe(
            (data2: any) => {
              this.usuario2 = data2;
              this.notificacionesService.getAlertsSupplier(data2.supplier.id).subscribe(alerts => {
                for (const alert of alerts) {
                  if (alert.turn.schedule.supplier.id === data2.supplier.id) {
                    this.quantity++ 
                  }
                }
              })
            });
        }
        if (this.usuario?.roles) {
          for (const role of roles) {
            p.push(role);
          }
        }
        this.profileTypes = p;
        this.userName = data.username; // Asigna el nombre de usuario
        this.userRole = data.roles;
        this.userRole = this.translateRole(data.roles);
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }

  translateRole(role: string): string {
    switch (role) {
      case 'user,supplier':
        return 'Proveedor';
      case 'user,client':
        return 'Cliente';
      case 'user,admin':
        return 'Administrador';
      case 'user,client,admin':
        return 'Administrador, Cliente';
      default:
        return 'Desconocido';
    }
  }

  toggleCollapse(collapseId: string) {
    // Cambia el estado del colapso con el ID proporcionado
    this.isCollapseOpenMap[collapseId] = !this.isCollapseOpenMap[collapseId];
  }

  isCollapseOpen(collapseId: string): boolean {
    // Verifica si el colapso con el ID proporcionado está abierto
    return this.isCollapseOpenMap[collapseId];
  }

  logout() {
    // Agrega aquí la lógica para cerrar sesión, como eliminar tokens de autenticación, etc.
    localStorage.removeItem('token');
    // Luego, redirige a la página de inicio de sesión o la página de inicio de la aplicación.
    this.router.navigate(['/login']); // Reemplaza 'login' con la ruta correcta.
  }
}

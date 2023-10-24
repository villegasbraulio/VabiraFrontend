import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../users/users.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  usuario: any;
  userName: string = '';
  userRole: string = '';
constructor(private router: Router, private userService: UserService) {
  this.usuario = null;
}
profileTypes: string[] = [];// Almacena los datos del usuario en la variable 'usuario'

ngOnInit() {
  // Llama a un método del servicio de autenticación para obtener los datos del usuario
  this.userService.obtenerPerfil().subscribe(
    (data: any) => {
      this.usuario = data; 
      const p: string[] = [];
      const roles = this.usuario.roles.split(',')  
      if (this.usuario?.roles) {   
        for (const role of roles) {
          p.push(role);         
        }       
      }         
      this.profileTypes = p;
      this.userName = data.username; // Asigna el nombre de usuario
      this.userRole = data.roles;
    },
    (error) => {
      console.error('Error al obtener los datos del usuario:', error);
    }
  );
}

  logout() {
    // Agrega aquí la lógica para cerrar sesión, como eliminar tokens de autenticación, etc.
    localStorage.removeItem('token');
    // Luego, redirige a la página de inicio de sesión o la página de inicio de la aplicación.
    this.router.navigate(['/login']); // Reemplaza 'login' con la ruta correcta.
  }
}


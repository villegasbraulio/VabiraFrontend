import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/users/users.service'; // Importa tu servicio de usuario

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userName: string = '';
  userRole: string = '';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    // Obtén los datos del usuario al inicializar el componente
    this.userService.obtenerPerfilUsuario().subscribe(
      (userData: any) => {
        this.userName = userData.username; // Asigna el nombre de usuario
        this.userRole = userData.roles; // Asigna el rol del usuario
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
        // Maneja el error aquí, por ejemplo, redirigiendo al usuario a la página de inicio de sesión.
        this.router.navigate(['/login']); // Reemplaza 'login' con la ruta correcta.
      }
    );
  }

  logout() {
    // Agrega aquí la lógica para cerrar sesión, como eliminar tokens de autenticación, etc.
    
    // Luego, redirige a la página de inicio de sesión o la página de inicio de la aplicación.
    this.router.navigate(['/login']); // Reemplaza 'login' con la ruta correcta.
  }
}


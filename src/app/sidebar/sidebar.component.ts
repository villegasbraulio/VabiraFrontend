import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
constructor(private router: Router) {}

  logout() {
    // Agrega aquí la lógica para cerrar sesión, como eliminar tokens de autenticación, etc.
    
    // Luego, redirige a la página de inicio de sesión o la página de inicio de la aplicación.
    this.router.navigate(['/login']); // Reemplaza 'login' con la ruta correcta.
  }
}

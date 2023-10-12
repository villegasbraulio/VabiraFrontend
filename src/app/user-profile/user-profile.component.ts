// user-profile.component.ts

import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/users/users.service'; // Importa tu servicio de usuario

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userProfileData: any;

  constructor(private usersService: UserService) {}

  ngOnInit(): void {
  this.usersService.obtenerPerfilUsuario().subscribe((data: any) => {
    this.userProfileData = data;
    console.log(this.userProfileData); // Agrega esta línea para verificar los datos
  });
}
}


//muestra los titulos pero no los datos
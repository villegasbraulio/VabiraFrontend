// export const adminGuard: CanActivateFn = (route, state) => {
//     const authService = inject(AuthService);
//     const user = authService.returnUser();
//     console.log(user);
  
//     if (user) {
//       console.log(user);
  
//       const isValid = user.userProfile.filter(
//         (o) => o.profile.name === 'Administrador Activo'
//       )[0];
//       if (isValid) {
//         return true;
//       } else {
//         return false;
//       }
//     } else {
//       return false;
//     }
//   };
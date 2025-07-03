import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule, MatSnackBarModule ], // ✅ AGREGA HttpClientModule
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class Auth {
  showRegister = false;

  email = '';
  password = '';
  firstName = '';
  lastName = '';

  constructor(private authService: AuthService, private snackBar: MatSnackBar ) {}

  toggleForm() {
    this.showRegister = !this.showRegister;
  }

   login() {
  //   this.authService.login(this.email, this.password).subscribe({
  //     next: (response) => console.log('Login correcto', response),
  //     error: (err) => console.error('Error en login', err)
  //   });
   }

   register() {
  const user = {
    email: this.email,
    password: this.password,
    firstName: this.firstName,
    lastName: this.lastName
  };

  this.authService.register(user).subscribe({
    next: (response) => {
      this.snackBar.open('Registro exitoso 🎉', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
      this.toggleForm(); // Cambia a login después del registro exitoso
    },
    error: (err) => {
      
      const errorMsg = err.error?.message || 'Error desconocido en el registro';

      this.snackBar.open(errorMsg, 'Cerrar', {
        duration: 10000,
        panelClass: ['snackbar-error']
      });

      console.error('Error en registro', err);
    }
  });
}


}


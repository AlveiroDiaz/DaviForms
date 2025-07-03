import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class Auth implements OnInit {
  showRegister = false;
  email = '';
  password = '';
  firstName = '';
  lastName = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.router.navigate(['/admin']);
    }
  }

  toggleForm() {
    this.showRegister = !this.showRegister;
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('accessToken', response.accessToken);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        alert(err?.error?.message || 'Error al iniciar sesión');
      }
    });
  }

  register() {
    const user = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName
    };

    this.authService.register(user).subscribe({
      next: () => {
        this.snackBar.open('Registro exitoso 🎉', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.toggleForm();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Error desconocido en el registro';
        this.snackBar.open(errorMsg, 'Cerrar', {
          duration: 10000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}

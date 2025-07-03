import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.snackBar.open('Debes iniciar sesión primero', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });

      this.router.navigate(['/']); // Cambia según tu ruta de login
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.snackBar.open('Sesión cerrada correctamente', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
    this.router.navigate(['/']);
  }

}

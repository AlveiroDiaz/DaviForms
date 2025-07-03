import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // o en core.module.ts si tienes uno
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users'; // 👈 cambia esto

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(user: { email: string, password: string, firstName: string, lastName:string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    // lógica para limpiar token/localStorage, etc.
  }
}

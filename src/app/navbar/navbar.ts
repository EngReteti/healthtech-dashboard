import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  constructor(private router: Router) {}

  // Reads the role we saved during login, so the navbar can show it 
  // (and later, show different links depending on who's logged in)
  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  // Clears the saved token and role, then sends the user back to login - 
  // this is the entire "logout" process, since there's no server-side 
  // session to end (remember, our backend is STATELESS)
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {

  // Holds the real logged-in user's name and role, fetched fresh - 
  // this is what actually lets someone SEE whether they're using 
  // the Auditor or Storekeeper account, not just guess from memory
  userName = signal<string>('');
  userRole = signal<string>('');

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userName.set(user.name);
        this.userRole.set(user.role);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}

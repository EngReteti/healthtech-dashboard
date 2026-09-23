import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../services/user.service';
import { toFriendlyMessage } from '../utils/http-error.util';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {

  users = signal<User[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  submitting = signal<boolean>(false);
  showForm = signal<boolean>(false);
  processingId = signal<number | null>(null);

  name: string = '';
  email: string = '';
  password: string = '';
  role: string = 'STOREKEEPER';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.password.length < 8) {
      this.errorMessage.set('Password must be at least 8 characters.');
      return;
    }

    this.submitting.set(true);

    this.userService.createUser({
      name: this.name,
      email: this.email,
      passwordHash: this.password,
      role: this.role
    }).subscribe({
      next: (newUser) => {
        this.submitting.set(false);
        this.successMessage.set(`${newUser.name} added as ${newUser.role}.`);
        this.users.update((current) => [...current, newUser]);
        this.name = '';
        this.email = '';
        this.password = '';
        this.role = 'STOREKEEPER';
        this.showForm.set(false);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }

  // Toggles between deactivate and reactivate depending on the 
  // user's CURRENT state, so one button does the right thing 
  // either way, rather than needing two separate buttons per row
  toggleActive(user: User): void {
    this.processingId.set(user.id);
    this.errorMessage.set('');

    const request = user.active
      ? this.userService.deactivateUser(user.id)
      : this.userService.reactivateUser(user.id);

    request.subscribe({
      next: (updatedUser) => {
        this.processingId.set(null);
        // Update just this one row in the list, rather than 
        // re-fetching everything from the server
        this.users.update((current) =>
          current.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
      },
      error: (err) => {
        this.processingId.set(null);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }
}

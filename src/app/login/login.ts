import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// @Component is Angular's equivalent of Spring's @Service/@Entity - 
// it tells Angular "this class controls a piece of UI." selector is 
// the custom HTML tag this component becomes; templateUrl/styleUrl 
// point to its paired HTML/CSS files
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  // These two hold whatever the user types into the form fields - 
  // FormsModule is what lets our HTML directly read/write these
  email: string = '';
  password: string = '';

  // Holds an error message to show the user if login fails - 
  // empty string means "no error to show"
  errorMessage: string = '';

  // Angular automatically "injects" HttpClient and Router here - 
  // similar to @Autowired on the backend, we just declare we need 
  // them and Angular provides working instances
  constructor(private http: HttpClient, private router: Router) {}

  // This runs when the user clicks the "Sign in" button
  onSubmit() {
    this.errorMessage = '';

    this.http.post<{ token: string, role: string }>(
      'http://localhost:8080/api/auth/login',
      { email: this.email, password: this.password }
    ).subscribe({
      // This runs if the backend responds successfully
      next: (response) => {
        // Store the token in the browser's local storage, so it 
        // survives page reloads and can be attached to future requests
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);

        // Send the user to the dashboard now that they're logged in
        this.router.navigate(['/dashboard']);
      },
      // This runs if the backend rejects the login (wrong credentials)
      error: (err) => {
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    });
  }
}

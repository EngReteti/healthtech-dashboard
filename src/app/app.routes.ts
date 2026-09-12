import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';

// Routes is Angular's map of "URL path" → "which component to show".
// This is the actual mechanism that makes /login and /dashboard 
// behave like real, separate pages
export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },

  // If someone visits the site with no path at all (just "/"), 
  // automatically redirect them to the login page
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

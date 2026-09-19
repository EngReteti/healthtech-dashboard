import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { StockMovement } from './stock-movement/stock-movement';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'stock-movement', component: StockMovement },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

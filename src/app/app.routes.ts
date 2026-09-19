import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Layout } from './layout/layout';
import { Dashboard } from './dashboard/dashboard';
import { StockMovement } from './stock-movement/stock-movement';

export const routes: Routes = [
  { path: 'login', component: Login },

  // Layout is now the parent - its sidebar shows on every page 
  // listed inside "children", with the matching page rendered 
  // into the <router-outlet> we just placed next to the sidebar
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'stock-movement', component: StockMovement }
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

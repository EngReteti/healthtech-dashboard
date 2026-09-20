import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Layout } from './layout/layout';
import { Dashboard } from './dashboard/dashboard';
import { StockMovement } from './stock-movement/stock-movement';
import { MovementHistory } from './movement-history/movement-history';
import { Approvals } from './approvals/approvals';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'stock-movement', component: StockMovement },
      { path: 'movement-history', component: MovementHistory },
      { path: 'approvals', component: Approvals }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

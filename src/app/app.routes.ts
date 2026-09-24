import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Layout } from './layout/layout';
import { Dashboard } from './dashboard/dashboard';
import { StockMovement } from './stock-movement/stock-movement';
import { MovementHistory } from './movement-history/movement-history';
import { Approvals } from './approvals/approvals';
import { Suppliers } from './suppliers/suppliers';
import { Products } from './products/products';
import { Departments } from './departments/departments';
import { Users } from './users/users';
import { Batches } from './batches/batches';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'stock-movement', component: StockMovement },
      { path: 'movement-history', component: MovementHistory },
      { path: 'approvals', component: Approvals },
      { path: 'suppliers', component: Suppliers },
      { path: 'products', component: Products },
      { path: 'departments', component: Departments },
      { path: 'users', component: Users },
      { path: 'batches', component: Batches }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

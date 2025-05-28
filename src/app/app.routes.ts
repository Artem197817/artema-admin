import { Routes } from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';
import {MainComponent} from './shared/main/main.component';
import {authGuard} from './core/auth/auth.guard';

export const routes: Routes = [
  {path: '',
    component: LayoutComponent,
    canActivateChild: [authGuard],
    children: [
      {path: '', component: MainComponent},
      {path: 'order/:orderId', loadComponent: () => import('./shared').then(m => m.OrderComponent)},
    ]},
  {
    path: 'login',
    loadComponent: () => import('./shared').then(m => m.LoginComponent)
  },
  { path: '**', redirectTo: '' }
];

// export const routes: Routes = [
//   {
//     path: '',
//     component: LayoutComponent,
//     canActivate: [authGuard],
//     children: [
//       { path: '', component: MainComponent },
//       {
//         path: 'order/:orderId',
//         loadComponent: () => import('./order.component').then(m => m.OrderComponent)
//       }
//     ]
//   },
//   {
//     path: 'login',
//     loadComponent: () => import('./login.component').then(m => m.LoginComponent)
//   },
//   { path: '**', redirectTo: '' }
// ];

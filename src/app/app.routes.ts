import { Routes } from '@angular/router';
import { homeResolver } from './resolvers/home-resolver';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    resolve: { data: homeResolver }
  },

  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'privacy-policy', loadComponent: () => import('./pages/privacy-policy/privacy-policy.page').then(m => m.PrivacyPolicyPage) },
  { path: '**', redirectTo: '' }
];

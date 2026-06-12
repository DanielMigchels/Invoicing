import { Routes } from '@angular/router';
import { authenticationGuard } from '../guards/authentication-guard';
import { AuthLayoutComponent } from './layout/auth-layout-component/auth-layout-component';
import { PortalLayoutComponent } from './layout/portal-layout-component/portal-layout-component';
import { BaseLayoutComponent } from './layout/base-layout-component/base-layout-component';
import { WebPage } from './web-page/web-page';
import { Login } from './login/login';
import { Invoices } from './invoices/invoices';
import { Companies } from './companies/companies';
import { Customers } from './customers/customers';

export const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      { path: '', component: WebPage },
    ]
  },
  {
    path: 'portal',
    component: PortalLayoutComponent,
    canActivate: [authenticationGuard],
    children: [
      { path: 'invoices', component: Invoices },
      { path: 'customers', component: Customers },
      { path: 'companies', component: Companies },
    ]
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: Login },
    ]
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];
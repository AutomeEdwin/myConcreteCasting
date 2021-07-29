import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { JobsiteDashboardComponent } from './jobsite-dashboard/jobsite-dashboard.component';
import { JobsiteViewerComponent } from './jobsite-viewer/jobsite-viewer.component';
import { AccountManagerComponent } from './account-manager/account-manager.component';
import { AuthguardService } from './services/authguard.service';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    canActivate: [AuthguardService],
    component: JobsiteDashboardComponent,
  },
  {
    path: 'jobsite/:id',
    canActivate: [AuthguardService],
    component: JobsiteViewerComponent,
  },
  {
    path: 'account',
    canActivate: [AuthguardService],
    component: AccountManagerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

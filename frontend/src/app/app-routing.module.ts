import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './features/components/register/register.component';
import { LoginComponent } from './features/components/login/login.component';
import { JobsiteDashboardComponent } from './core/components/jobsite-dashboard/jobsite-dashboard.component';
import { JobsiteViewerComponent } from './core/components/jobsite-viewer/jobsite-viewer.component';
import { AccountManagerComponent } from './core/components/account-manager/account-manager.component';
import { AuthguardService } from './core/services/authguard.service';
import { NewJobsiteComponent } from './features/components/new-jobsite/new-jobsite.component';

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
    path: 'newJobsite',
    canActivate: [AuthguardService],
    component: NewJobsiteComponent,
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

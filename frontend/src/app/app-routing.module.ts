import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { JobsiteDashboardComponent } from './jobsite-dashboard/jobsite-dashboard.component';

import { AuthguardService } from './services/authguard.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  {
    path: 'dashboard',
    canActivate: [AuthguardService],
    component: JobsiteDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

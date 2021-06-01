import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { JobsiteDashboardComponent } from './jobsite-dashboard/jobsite-dashboard.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'dashboard', component: JobsiteDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

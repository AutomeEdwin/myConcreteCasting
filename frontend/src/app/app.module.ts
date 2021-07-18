import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

// Components import
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { JobsiteDashboardComponent } from './jobsite-dashboard/jobsite-dashboard.component';
import { LogoutComponent } from './logout/logout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewJobsiteComponent } from './new-jobsite/new-jobsite.component';
import { JobsiteViewerComponent } from './jobsite-viewer/jobsite-viewer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { JobsitePreviewCardComponent } from './jobsite-preview-card/jobsite-preview-card.component';
import { ConfirmJobsiteDeleteComponent } from './confirm-jobsite-delete/confirm-jobsite-delete.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
  ],
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    JobsiteDashboardComponent,
    NewJobsiteComponent,
    LogoutComponent,
    JobsiteViewerComponent,
    NavbarComponent,
    JobsitePreviewCardComponent,
    ConfirmJobsiteDeleteComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

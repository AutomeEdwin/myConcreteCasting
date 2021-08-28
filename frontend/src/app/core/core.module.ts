import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';

// https://www.npmjs.com/package/@angular-material-components/datetime-picker
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';

import { AccountService } from './services/account.service';
import { AuthguardService } from './services/authguard.service';
import { JobsitesService } from './services/jobsites.service';
import { LocalStorageService } from './services/localstorage.service';
import { NominatimService } from './services/nominatim.service';
import { OpenweatherService } from './services/openweather.service';
import { AccountManagerComponent } from './components/account-manager/account-manager.component';
import { CastingViewerComponent } from './components/casting-viewer/casting-viewer.component';
import { ConfirmJobsiteDeleteComponent } from './components/confirm-jobsite-delete/confirm-jobsite-delete.component';
import { JobsiteDashboardComponent } from './components/jobsite-dashboard/jobsite-dashboard.component';
import { JobsitePreviewCardComponent } from './components/jobsite-preview-card/jobsite-preview-card.component';
import { JobsiteViewerComponent } from './components/jobsite-viewer/jobsite-viewer.component';

@NgModule({
  declarations: [
    AccountManagerComponent,
    CastingViewerComponent,
    ConfirmJobsiteDeleteComponent,
    JobsiteDashboardComponent,
    JobsitePreviewCardComponent,
    JobsiteViewerComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    NgxMatNativeDateModule,
    NgxMatDatetimePickerModule,
  ],
  providers: [
    AccountService,
    AuthguardService,
    JobsitesService,
    LocalStorageService,
    NominatimService,
    OpenweatherService,
  ],
})
export class CoreModule {}

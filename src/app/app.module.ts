import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSliderModule} from '@angular/material/slider';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';

import { LocalStorageService } from './components/services/localstorage.service';
import { HueConnectComponent } from './hue-connect/hue-connect.component';
import { SetupComponent } from './setup/setup.component';
import { LiveComponent } from './live/live.component';

import { AppRoutingModule }     from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HueService } from './components/services/hue.service';
import { StartupComponent } from './startup/startup.component';

const appRoutes: Routes = [{
  path: '',
  redirectTo: '/dashboard/live',
  pathMatch: 'full'
}];


@NgModule({
  declarations: [
    AppComponent,
    HueConnectComponent,
    SetupComponent,
    LiveComponent,
    StartupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSliderModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatTooltipModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSelectModule
  ],
  providers: [HueService, LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

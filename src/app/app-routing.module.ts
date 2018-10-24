import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartupComponent }   from './startup/startup.component';
import { HueConnectComponent }   from './hue-connect/hue-connect.component';
import { SetupComponent }      from './setup/setup.component';
import { LiveComponent }  from './live/live.component';

const routes: Routes = [
  { path: '', redirectTo: '/startup', pathMatch: 'full' },
  { path: 'startup', component: StartupComponent },
  { path: 'connect', component: HueConnectComponent },
  { path: 'setup', component: SetupComponent },
  { path: 'live', component: LiveComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

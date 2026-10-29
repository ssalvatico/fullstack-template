import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';
import { EntitiesModule } from './entities/entities.module';


import { App } from './app.component';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    EntitiesModule
],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
  ],
  bootstrap: [App]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageComponent } from './pages/home/home-page.component';
import { RenderEntityComponent } from './components/render-entity/render-entity.component';

// import {  } from '';

@NgModule({
  imports: [CommonModule],
  exports: [HomePageComponent, RenderEntityComponent],
  declarations: [HomePageComponent, RenderEntityComponent],
  providers: [],
})
export class EntitiesModule {}

import { NgModule } from '@angular/core';
import { HomePageComponent } from './pages/home/home-page.component';
import { RenderEntityComponent } from './components/render-entity/render-entity.component';

// import {  } from '';

@NgModule({
  imports: [RenderEntityComponent],
  exports: [HomePageComponent],
  declarations: [HomePageComponent],
  providers: [],
})
export class EntitiesModule {}

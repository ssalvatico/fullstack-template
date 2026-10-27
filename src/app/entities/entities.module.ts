import { NgModule } from '@angular/core';
import { HomePageComponent } from './pages/home/home-page.component';
import { CommonModule } from '@angular/common';
import { RenderEntityComponent } from './components/render-entity/render-entity.component';
import { EntityFormComponent } from './components/entity-form/entity-form.component';

@NgModule({
  imports: [CommonModule],
  exports: [HomePageComponent],
  declarations: [
    HomePageComponent,
    RenderEntityComponent,
    EntityFormComponent,
  ],
})
export class EntitiesModule {}
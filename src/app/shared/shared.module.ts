import { NgModule } from '@angular/core';

import { EntityListComponent } from './components/entity-list/entity-list.component';

@NgModule({
  exports: [EntityListComponent],
  declarations: [EntityListComponent],
})
export class SharedModule {}

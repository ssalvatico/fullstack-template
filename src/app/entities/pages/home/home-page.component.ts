import { Component } from '@angular/core';
import { EntityListComponent } from '../../../shared/components/entity-list/entity-list.component';

@Component({
  selector: 'app-home-page',
  standalone: false,
  styleUrl: './home-page.component.css',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
    constructor(private entityListComponent: EntityListComponent){}

    get entityItems(){
      return this.entityListComponent.items();
    }
}

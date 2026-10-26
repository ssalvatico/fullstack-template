import { Component, inject } from '@angular/core';
import { EntityStateService } from '../../services/entity-state.service';

@Component({
  selector: 'app-home-page',
  standalone: false,
  styleUrl: './home-page.component.css',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  private entityState = inject(EntityStateService);

  public items = this.entityState.items;
  public selectedEntity = this.entityState.selectedEntity;
}
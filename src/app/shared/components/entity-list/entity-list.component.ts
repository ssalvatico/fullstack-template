import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../../entities/services/backend.service';
import { EntityStateService, EntityRow } from '../../../entities/services/entity-state.service';

@Component({
  selector: 'app-shared-entity-list',
  standalone: false,
  styleUrl: './entity-list.css',
  templateUrl: './entity-list.html',
})
export class EntityListComponent implements OnInit {
  private apiService = inject(ApiService);
  private entityState = inject(EntityStateService);

  public entities = this.apiService.entities;
  public selectedEntity = this.entityState.selectedEntity;

  ngOnInit(): void {
    this.apiService.getEntities().subscribe({
      error: error => console.error('Error al obtener las entidades:', error),
    });
  }

  getEntityData([name, endpoint]: [string, string]): void {
    this.apiService.getEntityProperties<EntityRow>(endpoint).subscribe({
      next: items => this.entityState.setSelection(name, items),
      error: error => console.error('Error al obtener las propiedades:', error),
    });
  }
}
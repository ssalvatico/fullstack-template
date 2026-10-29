import { Component, OnInit, inject } from '@angular/core';
import { forkJoin, of, switchMap, map } from 'rxjs';
import { ApiService } from '../../../entities/services/api.service';
import { EntityStateService, EntityRow } from '../../../entities/services/entity-state.service';
import { RelationOption } from '../../../entities/interfaces/hydra-docs';

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
    forkJoin({
      items: this.apiService.getEntityProperties<EntityRow>(endpoint),
      fields: this.apiService.getFormFields(endpoint),
    }).pipe(
      switchMap(({ items, fields }) => {
        const relationFields = fields.filter(f => f.type === 'relation' && f.target);
        const targets = [...new Set(relationFields.map(f => f.target!))];

        const optionsByTarget$ = targets.length
          ? forkJoin(
              Object.fromEntries(targets.map(t => [t, this.apiService.getRelationOptions(t)]))
            )
          : of({} as Record<string, RelationOption[]>);

        return optionsByTarget$.pipe(
          map(optionsByTarget => {
            const relationLabels: Record<string, string> = {};
            Object.values(optionsByTarget).forEach(opts =>
              opts.forEach(o => (relationLabels[o.iri] = o.label))
            );

            const relationOptions: Record<string, RelationOption[]> = {};
            relationFields.forEach(f => {
              relationOptions[f.name] = optionsByTarget[f.target!] ?? [];
            });

            return { items, fields, relationLabels, relationOptions };
          })
        );
      })
    ).subscribe({
      next: ({ items, fields, relationLabels, relationOptions }) =>
        this.entityState.setSelection(name, endpoint, items, fields, relationLabels, relationOptions),
      error: error => console.error('Error al cargar la entidad:', error),
    });
  }
}
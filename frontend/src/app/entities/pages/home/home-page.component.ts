import { Component, effect, inject, signal } from '@angular/core';
import { EntityRow, EntityStateService } from '../../services/entity-state.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  private entityState = inject(EntityStateService);
  private api = inject(ApiService);

  public items = this.entityState.items;
  public selectedEntity = this.entityState.selectedEntity;
  public fields = this.entityState.fields;
  public relationLabels = this.entityState.relationLabels;
  public relationOptions = this.entityState.relationOptions;

  public formOpen = signal(false);
  public editingRow = signal<EntityRow | null>(null);

  constructor() {
    effect(() => {
      this.selectedEntity();
      this.closeForm();
    });
  }

  openCreate(): void {
    this.editingRow.set(null);
    this.formOpen.set(true);
  }

  openEdit(row: EntityRow): void {
    this.editingRow.set(row);
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
    this.editingRow.set(null);
  }

  onSave(values: EntityRow): void {
    const endpoint = this.entityState.endpoint();
    if (!endpoint) return;

    const body = Object.fromEntries(this.fields().map(f => [f.name, values[f.name]]));

    const row = this.editingRow();
    const req$ = row
      ? this.api.updateEntity(row['@id'] as string, body)
      : this.api.createEntity(endpoint, body);

    req$.subscribe({
      next: () => {
        this.closeForm();
        this.reload();
      },
      error: err => console.error('Error al guardar:', err),
    });
  }

  onDelete(row: EntityRow): void {
    if (!confirm('¿Eliminar este elemento?')) return;

    this.api.deleteEntity(row['@id'] as string).subscribe({
      next: () => this.reload(),
      error: err => console.error('Error al eliminar:', err),
    });
  }

  private reload(): void {
    const endpoint = this.entityState.endpoint();
    if (!endpoint) return;

    this.api.getEntityProperties<EntityRow>(endpoint).subscribe({
      next: items => this.entityState.setItems(items),
      error: err => console.error('Error al recargar:', err),
    });
  }
}
import { Component, computed, input, output } from '@angular/core';
import { EntityRow } from '../../services/entity-state.service';

@Component({
  selector: 'app-entities-render-entity',
  standalone: false,
  templateUrl: './render-entity.component.html',
  styleUrl: './render-entity.component.css',
})
export class RenderEntityComponent {
  public entityName = input<string | null>(null);
  public items = input<EntityRow[]>([]);
  public relationLabels = input<Record<string, string>>({});

  public create = output<void>();
  public edit = output<EntityRow>();
  public remove = output<EntityRow>();

  public columns = computed(() => {
    const first = this.items()[0];
    return first ? Object.keys(first).filter(key => !key.startsWith('@')) : [];
  });

  formatValue(value: unknown): string {
    if (Array.isArray(value)) {
      return value.map(v => this.resolveOne(v)).join(', ');
    }
    return this.resolveOne(value);
  }

  private resolveOne(value: unknown): string {
    if (typeof value === 'string') {
      const label = this.relationLabels()[value];
      if (label) return label;
      if (value.startsWith('/api/')) return value.split('/').pop() ?? value;
    }
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  createEntity(): void { this.create.emit(); }
  updateEntity(row: EntityRow): void { this.edit.emit(row); }
  deleteEntity(row: EntityRow): void { this.remove.emit(row); }
}
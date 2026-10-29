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
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') {
      return this.formatToDateTime(value);
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  private formatToDateTime(value:string){
  // Detectar fechas ISO 8601 provenientes del backend
    const dateRegex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

    if (dateRegex.test(value)) {
      const date = new Date(value);

      if (!isNaN(date.getTime())) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
      }
    }

    const label = this.relationLabels()[value];
    if (label) return label;

    if (value.startsWith('/api/')) {
      return value.split('/').pop() ?? value;
    }
    return value;
  }

  createEntity(): void { this.create.emit(); }
  updateEntity(row: EntityRow): void { this.edit.emit(row); }
  deleteEntity(row: EntityRow): void { this.remove.emit(row); }
}
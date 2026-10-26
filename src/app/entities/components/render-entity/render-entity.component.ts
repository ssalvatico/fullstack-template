import { Component, computed, input } from '@angular/core';
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

  public columns = computed(() => {
    const first = this.items()[0];
    return first ? Object.keys(first).filter(key => !key.startsWith('@')) : [];
  });

  formatValue(value: unknown): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  agregarEntidad(): void {console.log('add');}
  editarEntidad (row:any): void {console.log(row);}
  eliminarEntidad (row:any): void {console.log(row);}
}
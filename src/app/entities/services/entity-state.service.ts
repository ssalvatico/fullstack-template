import { Injectable, signal } from '@angular/core';

export type EntityRow = Record<string, unknown>;

@Injectable({
  providedIn: 'root',
})
export class EntityStateService {
  private _selectedEntity = signal<string | null>(null);
  private _items = signal<EntityRow[]>([]);

  public readonly selectedEntity = this._selectedEntity.asReadonly();
  public readonly items = this._items.asReadonly();

  setSelection(name: string, items: EntityRow[]): void {
    this._selectedEntity.set(name);
    this._items.set(items);
  }
}
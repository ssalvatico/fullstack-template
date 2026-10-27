import { Injectable, signal } from '@angular/core';
import { FormField, RelationOption } from '../interfaces/hydra-docs';

export type EntityRow = Record<string, unknown>;

@Injectable({ providedIn: 'root' })
export class EntityStateService {
  private _selectedEntity = signal<string | null>(null);
  private _endpoint = signal<string | null>(null);
  private _items = signal<EntityRow[]>([]);
  private _fields = signal<FormField[]>([]);
  private _relationLabels = signal<Record<string, string>>({});
  private _relationOptions = signal<Record<string, RelationOption[]>>({});

  public readonly selectedEntity = this._selectedEntity.asReadonly();
  public readonly endpoint = this._endpoint.asReadonly();
  public readonly items = this._items.asReadonly();
  public readonly fields = this._fields.asReadonly();
  public readonly relationLabels = this._relationLabels.asReadonly();
  public readonly relationOptions = this._relationOptions.asReadonly();

  setSelection(
    name: string,
    endpoint: string,
    items: EntityRow[],
    fields: FormField[],
    relationLabels: Record<string, string>,
    relationOptions: Record<string, RelationOption[]>
  ): void {
    this._selectedEntity.set(name);
    this._endpoint.set(endpoint);
    this._items.set(items);
    this._fields.set(fields);
    this._relationLabels.set(relationLabels);
    this._relationOptions.set(relationOptions);
  }

  setItems(items: EntityRow[]): void {
    this._items.set(items);
  }
}
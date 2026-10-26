import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../../entities/services/backend.service';

@Component({
  selector: 'app-shared-entity-list',
  standalone: false,
  styleUrl: './entity-list.css',
  templateUrl: './entity-list.html',
})
export class EntityListComponent implements OnInit {
  private apiService = inject(ApiService);

  public entities = this.apiService.entities;
  public selectedEntity = signal<string | null>(null);
  private _items = signal<unknown[]>([]);
  public items = this._items.asReadonly();

  ngOnInit(): void {
    this.apiService.getEntities().subscribe({
      error: error => console.error('Error al obtener las entidades:', error),
    });
  }

  getEntityData([name, endpoint]: [string, string]): void {
    this.selectedEntity.set(name);
    this.apiService.getEntityProperties(endpoint).subscribe({
      next: items => {this._items.set(items); console.table(this._items())},
      //TODO tengo que conectar el objeto con los campos al homepage para renderizar la vista
      error: error => console.error('Error al obtener las propiedades:', error),
    });
  }
}
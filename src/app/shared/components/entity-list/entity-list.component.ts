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

  entities = signal<[string, string][]>([]);

  ngOnInit(): void {
    this.apiService.getEntities().subscribe({
      next: entities => this.entities.set(entities),
      error: error => console.error('Error al obtener las entidades:', error),
    });
  }
}
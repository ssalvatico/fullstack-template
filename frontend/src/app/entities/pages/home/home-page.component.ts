import { Component, effect, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { EntityRow, EntityStateService } from '../../services/entity-state.service';
import { ApiService } from '../../services/api.service';

interface ServerValidationError {
  message: string;
  fields: Record<string, string>;
}

interface ProblemViolation {
  propertyPath: string;
  message: string;
}

interface ProblemDetails {
  detail?: string;
  violations?: ProblemViolation[];
}

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
  public serverError = signal<ServerValidationError | null>(null);

  constructor() {
    effect(() => {
      this.selectedEntity();
      this.closeForm();
    });
  }

  openCreate(): void {
    this.serverError.set(null);
    this.editingRow.set(null);
    this.formOpen.set(true);
  }

  openEdit(row: EntityRow): void {
    this.serverError.set(null);
    this.editingRow.set(row);
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
    this.editingRow.set(null);
    this.serverError.set(null);
  }

  onSave(values: EntityRow): void {
    const endpoint = this.entityState.endpoint();
    if (!endpoint) return;

    const body = Object.fromEntries(this.fields().map(f => [f.name, values[f.name]]));

    const row = this.editingRow();
    const req$ = row
      ? this.api.updateEntity(row['@id'] as string, body)
      : this.api.createEntity(endpoint, body);

    this.serverError.set(null);

    req$.subscribe({
      next: () => {
        this.closeForm();
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.serverError.set(this.toServerValidationError(err));
      },
    });
  }

  private toServerValidationError(err: HttpErrorResponse): ServerValidationError {
    const problem: ProblemDetails = err.error ?? {};
    const violations = problem.violations ?? [];

    const fields: Record<string, string> = {};
    for (const v of violations) {
      // API Platform puede devolver propertyPath anidado; tomamos el campo de primer nivel.
      const name = v.propertyPath.split('.')[0];
      fields[name] = fields[name] ? `${fields[name]} ${v.message}` : v.message;
    }

    const message =
      violations.length > 0
        ? violations.map(v => v.message).join(' ')
        : problem.detail ?? 'No se pudo guardar el registro. Intentá de nuevo.';

    return { message, fields };
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
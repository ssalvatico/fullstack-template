import { Component, effect, input, output, signal } from '@angular/core';
import { EntityRow } from '../../services/entity-state.service';
import { FormField, RelationOption } from '../../interfaces/hydra-docs';

@Component({
  selector: 'app-entity-form',
  standalone: false,
  templateUrl: './entity-form.component.html',
  styleUrl: './entity-form.component.css'
})
export class EntityFormComponent {
  public fields = input<FormField[]>([]);
  public initial = input<EntityRow | null>(null);
  public relationOptions = input<Record<string, RelationOption[]>>({});

  public save = output<EntityRow>();
  public cancel = output<void>();

  public values = signal<EntityRow>({});
  public errors = signal<Set<string>>(new Set());

  constructor() {
    effect(() => {
      this.values.set({ ...(this.initial() ?? {}) });
      this.errors.set(new Set());
    });
  }

  onInput(field: FormField, event: Event): void {
    const el = event.target as HTMLInputElement;

    let value: unknown;
    if (field.type === 'checkbox') value = el.checked;
    else if (field.type === 'number') value = el.value === '' ? null : Number(el.value);
    else value = el.value;

    this.values.update(v => ({ ...v, [field.name]: value }));
    this.clearError(field.name, value);
  }

  onMultiSelect(field: FormField, event: Event): void {
    const el = event.target as HTMLSelectElement;
    const selected = Array.from(el.selectedOptions).map(o => o.value);

    this.values.update(v => ({ ...v, [field.name]: selected }));
    this.clearError(field.name, selected);
  }

  isSelected(field: FormField, iri: string): boolean {
    const v = this.values()[field.name];
    return Array.isArray(v) && v.includes(iri);
  }

  submit(): void {
    const missing: string[] = [];

    // Recorremos los campos validando cuáles están vacíos
    for (const field of this.fields()) {
      if (field.required && field.type !== 'checkbox') {
        const val = this.values()[field.name];
        if (this.isEmpty(val)) {
          missing.push(field.name);
        }
      }
    }

    if (missing.length > 0) {
      // Forzamos un nuevo Set independiente para que el Signal dispare la reactividad visual
      this.errors.set(new Set(missing));
      return;
    }

    // Limpiamos errores si todo está bien y emitimos
    this.errors.set(new Set());
    this.save.emit(this.values());
  }

  private clearError(name: string, value: unknown): void {
    if (this.errors().has(name) && !this.isEmpty(value)) {
      // Creamos un nuevo Set excluyendo el campo resuelto para disparar el renderizado del Signal
      const currentErrors = this.errors();
      const next = new Set<string>();
      currentErrors.forEach(err => {
        if (err !== name) next.add(err);
      });
      this.errors.set(next);
    }
  }

  private isEmpty(value: any): boolean {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  }
}
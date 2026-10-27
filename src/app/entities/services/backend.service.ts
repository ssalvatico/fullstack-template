import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map, tap, switchMap, of } from 'rxjs';
import { HydraDocs, FormField, RelationOption, toFieldType } from '../interfaces/hydra-docs';

import { ApiRoot, ApiEntity } from '../interfaces/api-root';
import { env } from '../../environment/env';
import { HIDDEN_FIELDS, resolveDisplayValue } from '../config/field-mapper.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _entities = signal<[string, string][]>([]);
  public entities = this._entities.asReadonly();

  constructor(private http: HttpClient) {}

  getEntities(): Observable<[string, string][]> {
    return this.http.get<ApiRoot>(`${env.BASE_URL}${env.API_ENDPOINT}`).pipe(
      map(response => this.removeJsonLdKeywords(response)),
      map(entities => Object.entries(entities) as [string, string][]),
      tap(entities => this._entities.set(entities))
    );
  }

  getEntityProperties<T = unknown>(entityEndpoint: string): Observable<T[]> {
    return this.http.get<ApiEntity<T>>(`${env.BASE_URL}${entityEndpoint}`).pipe(
      map(response => response.member)
    );
  }

  private removeJsonLdKeywords<T extends ApiRoot>(
    response: T
  ): Omit<T, '@context' | '@id' | '@type'> {
    return Object.fromEntries(
      Object.entries(response).filter(([key]) => !key.startsWith('@'))
    ) as Omit<T, '@context' | '@id' | '@type'>;
  }

  getCollection<T = unknown>(endpoint: string): Observable<ApiEntity<T>> {
    return this.http.get<ApiEntity<T>>(`${env.BASE_URL}${endpoint}`);
  }

  getDocs(): Observable<HydraDocs> {
    return this.http.get<HydraDocs>(`${env.BASE_URL}/api/docs.jsonld`);
  }

  getFormFields(endpoint: string): Observable<FormField[]> {
    return this.getCollection(endpoint).pipe(map(col => (col['@context'] as string).split('/').pop()!),
      switchMap(shortName => this.getDocs().pipe(map(docs => {
        const cls = docs.supportedClass.find(c => c.title === shortName);
        return (cls?.supportedProperty ?? [])
          .filter(p => p.writable !== false)
          .map(p => {
            const range = p.property?.range;
            return {
              name: p.title ?? p.property?.label ?? '',
              required: p.required === true,
              type: toFieldType(range),
              target: range?.startsWith('#') ? range.slice(1) : undefined,
            };
          }).filter(f => !HIDDEN_FIELDS.includes(f.name));
        })
      ))
    );
  }

  createEntity<T>(endpoint: string, body: Partial<T>): Observable<T> {
    return this.http.post<T>(`${env.BASE_URL}${endpoint}`, body, {
      headers: { 'Content-Type': 'application/ld+json', Accept: 'application/ld+json' },
    });
  }

  updateEntity<T>(iri: string, body: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${env.BASE_URL}${iri}`, body, {
      headers: { 'Content-Type': 'application/merge-patch+json', Accept: 'application/ld+json' },
    });
  }

  deleteEntity(iri: string): Observable<void> {
    return this.http.delete<void>(`${env.BASE_URL}${iri}`);
  }
  
  getRelationOptions(target: string): Observable<RelationOption[]> {
    const endpoint = this.endpointForClass(target);
    if (!endpoint) return of([]);

    return this.getEntityProperties<Record<string, unknown>>(endpoint).pipe(
      map(items => items.map(item => ({
        iri: item['@id'] as string,
        label: this.labelFor(item, target),
      })))
    );
  }

  private labelFor(item: Record<string, unknown>, className?: string): string {
    return (
      resolveDisplayValue(item, className) ??
      (item['@id'] as string)?.split('/').pop() ??
      ''
    );
  }

  endpointForClass(className: string): string | undefined {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');
    const target = norm(className);
    const plural = target.endsWith('y') ? target.slice(0, -1) + 'ies' : target + 's';

    return this.entities().find(([name]) => {
      const n = norm(name);
      return n === target || n === plural;
    })?.[1];
  }
}
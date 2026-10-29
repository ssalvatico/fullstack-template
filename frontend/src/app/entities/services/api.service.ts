import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map, tap, switchMap, of, shareReplay, share } from 'rxjs';
import { HydraDocs, FormField, RelationOption, toFieldType } from '../interfaces/hydra-docs';

import { ApiRoot, ApiEntity } from '../interfaces/api-root';
import { env } from '../../environment/env';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private cacheEntities = new Map<string, Observable<ApiEntity<unknown>>>();
  private cacheDocs = new Map<string, Observable<HydraDocs>>();
  private _entities = signal<[string, string][]>([]);
  private HIDDEN_FIELDS = ['createdAt','updatedAt'];
  public entities = this._entities.asReadonly();

  constructor(private http: HttpClient) {}

  private invalidateCache(): void {
    this.cacheEntities.clear();
  }

  getEntities(): Observable<[string, string][]> {
    return this.http.get<ApiRoot>(`${env.BASE_URL}${env.API_ENDPOINT}`).pipe(
      map(response => this.removeJsonLdKeywords(response)),
      map(entities => Object.entries(entities) as [string, string][]),
      tap(entities => this._entities.set(entities))
    );
  }

  getDocs(): Observable<HydraDocs> {
    const cachedDocs = this.cacheDocs.get('docs');
    if (cachedDocs) {
      return cachedDocs;
    }
    const request$ = this.http.get<HydraDocs>(
      `${env.BASE_URL}${env.API_ENDPOINT}/docs.jsonld`
    ).pipe(shareReplay(1));
    
    this.cacheDocs.set('docs', request$);

    setTimeout(() => {
      this.cacheDocs.delete('docs');
    }, 5 * 60 * 1000);

    return request$;
  }

  private getRequest<T = unknown>(entityEndpoint: string): Observable<ApiEntity<T>> {
    let request$ = this.cacheEntities.get(entityEndpoint) as Observable<ApiEntity<T>> | undefined;
    if (!request$) {
      request$ = this.http
        .get<ApiEntity<T>>(`${env.BASE_URL}${entityEndpoint}`)
        .pipe(shareReplay(1));
      this.cacheEntities.set(entityEndpoint, request$ as Observable<ApiEntity<unknown>>);
      setTimeout(() => {
        if (this.cacheEntities.get(entityEndpoint) === request$) {
          this.cacheEntities.delete(entityEndpoint);
        }
      }, 5 * 60 * 1000);
    }
    return request$;
  }

  getCollection<T = unknown>(
    entityEndpoint: string
  ): Observable<ApiEntity<T>> {
    return this.getRequest<T>(entityEndpoint);
  }

  getEntityProperties<T = unknown>(
    entityEndpoint: string
  ): Observable<T[]> {
    return this.getRequest<T>(entityEndpoint).pipe(
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

  getFormFields(endpoint: string): Observable<FormField[]> {
    return this.getCollection(endpoint).pipe(map(col => (col['@context'] as string).split('/').pop()!),
      switchMap(shortName => this.getDocs().pipe(map(docs => {
        const cls = docs.supportedClass.find(c => c.title === shortName);
        return (cls?.supportedProperty ?? [])
          .filter(p => p.writable !== false)
          .map(p => {
            const range = p.property?.range;
            const type = toFieldType(range);
            const isRelation = type === 'relation';
            return {
              name: p.title ?? p.property?.label ?? '',
              required: p.required === true,
              type,
              target: range?.startsWith('#') ? range.slice(1) : undefined,
              multiple: isRelation && p.property?.['owl:maxCardinality'] !== 1,
            };
          }).filter(f => !this.HIDDEN_FIELDS.includes(f.name));
        })
      ))
    );
  }

  createEntity<T>(endpoint: string, body: Partial<T>): Observable<T> {
    return this.http.post<T>(`${env.BASE_URL}${endpoint}`, body, {
      headers: { 'Content-Type': 'application/ld+json', Accept: 'application/ld+json' },
    })
    .pipe(tap(() => this.invalidateCache()));
  }

  updateEntity<T>(iri: string, body: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${env.BASE_URL}${iri}`, body, {
      headers: { 'Content-Type': 'application/merge-patch+json', Accept: 'application/ld+json' },
    })
    .pipe(tap(() => this.invalidateCache()));
  }

  deleteEntity(iri: string): Observable<void> {
    return this.http.delete<void>(`${env.BASE_URL}${iri}`)
    .pipe(tap(() => this.invalidateCache()));
  }
  
  getRelationOptions(target: string): Observable<RelationOption[]> {
    const endpoint = this.endpointForClass(target);
    if (!endpoint) return of([]);

    return this.getEntityProperties<Record<string, unknown>>(endpoint).pipe(
      map(items => items.map(item => ({
        iri: item['@id'] as string,
        label: this.labelFor(item),
      })))
    );
  }
  
  private labelFor(item: Record<string, unknown>): string {
    return item['name'] as string;
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
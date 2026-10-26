import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

import { ApiRoot, APIEntity } from '../interfaces/api-root';
import { env } from '../../environment/env';

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
    return this.http.get<APIEntity<T>>(`${env.BASE_URL}${entityEndpoint}`).pipe(
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
}
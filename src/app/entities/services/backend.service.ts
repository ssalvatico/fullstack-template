import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { APIEntitiesResponse } from '../interfaces/ApiEntities';
import { env } from '../../environment/env';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  getEntities(): Observable<[string, string][]> {
    return this.http.get<APIEntitiesResponse>(env.apiUrl).pipe(
      map(response => {
        const entities = this.extractEntities(response);

        return Object.entries(entities) as [string, string][];
      })
    );
  }

  private extractEntities<T extends APIEntitiesResponse>(
    response: T
  ): Omit<T, '@context' | '@id' | '@type'> {

    return Object.fromEntries(
      Object.entries(response).filter(([key]) => !key.startsWith('@'))
    ) as Omit<T, '@context' | '@id' | '@type'>;
  }
}

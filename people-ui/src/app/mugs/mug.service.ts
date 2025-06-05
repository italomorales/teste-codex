import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Mug {
  id: number;
  name: string;
  description?: string;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class MugService {
  private baseUrl = 'https://zany-funicular-7v9prvrrpg62x5p9-5219.app.github.dev/mugs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Mug[]> {
    return this.http.get<Mug[]>(this.baseUrl).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  create(mug: Omit<Mug, 'id'>): Observable<any> {
    return this.http.post(this.baseUrl + '/', mug).pipe(
      catchError(err => throwError(() => err))
    );
  }

  update(id: number, mug: Omit<Mug, 'id'>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, mug).pipe(
      catchError(err => throwError(() => err))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}

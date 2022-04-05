import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  private readonly apiUrl = `${environment.apiUrl}genres`;

  constructor(private http: HttpClient) {}

  getAllGenres(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getall`);
  }

  getGenres(page: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getgenres`, {
      params: { page: page, pageSize: pageSize },
    });
  }

  getGenre(genreId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${genreId}`);
  }

  addGenre(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { name });
  }

  updateGenre(genreId: any, name: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${genreId}`, { name });
  }

  deleteGenre(genreId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${genreId}`);
  }

  getGenresCount(): Observable<any> {
    return this.http.get(`${environment.apiUrl}home/genres-count`);
  }

  searchGenres(queryParams: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?${queryParams}`);
  }

  getBooksNumberForGenre(genreId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/booksnum/${genreId}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private readonly apiUrl = `${environment.apiUrl}authors`;

  constructor(private http: HttpClient) {}

  getAllAuthors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getAuthors(page: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAuthors`, {
      params: { page: page, pageSize: pageSize },
    });
  }

  getAuthor(authorId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${authorId}`);
  }

  addAuthor(authorName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { authorName });
  }

  updateAuthor(authorId: any, authorName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${authorId}`, { authorName });
  }

  deleteAuthor(authorId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${authorId}`);
  }

  searchAuthors(queryParams: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?${queryParams}`);
  }

  getBooksNumberForAuthor(authorId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/booksnum/${authorId}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private readonly apiUrl = `${environment.apiUrl}books`;
  private readonly apiUrlRequests = `${environment.apiUrl}bookreservations`;

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getall`);
  }

  getBooks(page: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getbooks`, {
      params: { page: page, pageSize: pageSize },
    });
  }

  getBook(bookId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${bookId}`);
  }

  getBookReservations(page: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.apiUrlRequests}/getall`, {
      params: { page: page, pageSize: pageSize },
    });
  }

  getBookReservationDetails(bookReservationId: any): Observable<any> {
    return this.http.get(`${this.apiUrlRequests}/${bookReservationId}`);
  }

  rejectBookReservation(
    bookReservationId: any,
    librarianId: any,
    message: any
  ): Observable<any> {
    return this.http.post(`${this.apiUrlRequests}/reject-reservation`, {
      bookReservationId,
      librarianId,
      message,
    });
  }
  approveBookReservation(
    bookReservationId: any,
    librarianId: any,
    message: any
  ): Observable<any> {
    return this.http.post(`${this.apiUrlRequests}/approve-reservation`, {
      bookReservationId,
      librarianId,
      message,
    });
  }

  addBook(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, formData);
  }

  updateBook(bookId: any, formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${bookId}`, formData);
  }

  deleteBook(bookId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookId}`);
  }

  searchBooks(queryParams: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?${queryParams}`);
  }

  getLastAddedBooks(page: number, pageSize: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}home/last-books`, {
      params: { page: page, pageSize: pageSize },
    });
  }

  getBooksCount(): Observable<any> {
    return this.http.get(`${environment.apiUrl}home/books-count`);
  }

  getBookCover(bookId: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}blobs/${bookId}`, {
      responseType: 'text',
    });
  }

  addBookCover(image: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}blobs/uploadfile`, image);
  }

  updateBookCover(file: any, oldImage: any): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}blobs/updatefile/${oldImage}`,
      file
    );
  }

  compareBookQuantity(bookId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/quantity/${bookId}`);
  }
}

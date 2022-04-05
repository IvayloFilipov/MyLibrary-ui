import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReserveBookService {
  private readonly apiUrl = `${environment.apiUrl}bookReservations`;

  constructor(private http: HttpClient) { }

  reserveBook(UserId: any, BookId: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-reservation`, { UserId , BookId });
  }
}

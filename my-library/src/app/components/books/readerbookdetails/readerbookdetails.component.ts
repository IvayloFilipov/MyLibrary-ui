import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';
import { GenresService } from 'src/app/services/genres.service';
import { Location } from '@angular/common';
import { AuthorsService } from 'src/app/services/authors.service';
import { ReserveBookService } from 'src/app/services/reserve-book.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/auth.service';
import { DefaultBookCover } from 'src/app/components/books/defaultcover.component';

@Component({
  selector: 'app-readerbookdetails',
  templateUrl: './readerbookdetails.component.html',
  styleUrls: [
    '../../admin-menu/admin-menu.component.scss',
    '../books.component.scss',
    './readerbookdetails.component.scss',
  ],
})
export class ReaderBookDetailsComponent implements OnInit {
  public id: any;
  public userId: any;
  public loadedBook: any;
  public isInReserveProcess = false;

  constructor(
    private booksService: BooksService,
    private reserveBookService: ReserveBookService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private genresService: GenresService,
    private authorsService: AuthorsService,
    private modalService: ModalService,
    private userService: UserService
  ) {
    this.id = this.activatedRoute.snapshot.params['bookId'];
    this.userId = this.userService.getUserId();
  }

  ngOnInit(): void {
    this.getBook().then(() => {
      this.getAllGenres();
      this.getAllAuthors();
    });
  }

  public title = '';
  public genres = '';
  public authors = '';
  public description = '';
  public imageURL = null;
  public reservationAllowed = false;
  public reservationMsg = '';

  public loadedGenres: any[] = [];
  public loadedAuthors: any[] = [];

  public isGetFailed = false;
  public isGetGenresFailed = false;
  public isGetAuthorsFailed = false;
  public errorMessage = '';

  defaultCover = DefaultBookCover.defaultCover;

  back(): void {
    this.location.back();
  }

  reserveBook() {
    this.reserveBookService.reserveBook(this.userId, this.id).subscribe({
      next: (data) => {
        this.isInReserveProcess = true;
        this.reservationMsg = `Your reservation request for book '${this.loadedBook.title}' is sent.`;
      },
      error: (err) => {
        if (err.status == 404) {
          this.isInReserveProcess = true;
          this.reservationMsg = err.error;
        } else {
          this.reservationMsg = 'Server error';
        }
      },
    });
  }

  async getBook(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.booksService.getBook(this.id).subscribe({
        next: (data) => {
          this.loadedBook = data;
          this.title = data.title;
          this.authors = data.allAuthors;
          this.genres = data.allGenres;
          this.description = data.description;
          this.imageURL = data.imageAddress;

          if (
            data.isAvailable &&
            data.totalQuantity > 0 &&
            data.currentQuantity > 0
          ) {
            this.reservationAllowed = true;
          }
          resolve();
        },
        error: (err) => {
          this.isGetFailed = true;
          if (err.status == 404) {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Server error';
          }
          reject();
        },
      });
    });
  }

  getAllGenres() {
    this.isGetGenresFailed = false;

    this.genresService.getAllGenres().subscribe({
      next: (data) => {
        this.loadedGenres = data;
      },
      error: (err) => {
        this.isGetGenresFailed = true;
        if (err.status == 404) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Server error';
        }
      },
    });
  }

  getAllAuthors() {
    this.isGetAuthorsFailed = false;

    this.authorsService.getAllAuthors().subscribe({
      next: (data) => {
        this.loadedAuthors = data;
      },
      error: (err) => {
        this.isGetAuthorsFailed = true;
        if (err.status == 404) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Server error';
        }
      },
    });
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  isLibrarian() {
    return this.userService.isLibrarian();
  }
}

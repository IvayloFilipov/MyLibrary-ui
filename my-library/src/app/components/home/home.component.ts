import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/auth.service';
import { BooksService } from 'src/app/services/books.service';
import { GenresService } from 'src/app/services/genres.service';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faBookReader } from '@fortawesome/free-solid-svg-icons';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { DefaultBookCover } from 'src/app/components/books/defaultcover.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    '../books/books.component.scss',
    '../books/search/search.component.scss',
    './home.component.scss',
  ],
})
export class HomeComponent implements OnInit {
  public isGetBooksSuccessful: boolean = false;
  public isGetBooksFailed: boolean = false;
  public errorMessage: string = '';
  public descriptionInfoText = 'Books added in the last 14 days:';

  public loadedBooks: any[] = [];

  public currentPage: number = 1;
  public pageSize: number = 4;
  public totalPages: number = 1;
  public totalBooks: number = 0;

  faBook = faBook;
  faBookReader = faBookReader;
  faListAlt = faListAlt;
  faMagnifyingGlass = faMagnifyingGlass;
  defaultCover = DefaultBookCover.defaultCover;

  constructor(
    private booksService: BooksService,
    private genresService: GenresService,
    private authService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  public title: string = '';
  public authors: string = '';
  public description: string = '';

  public booksCount: number = 0;
  public genresCount: number = 0;
  public readersCount: number = 0;

  navigateTo(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: this.currentPage,
        pageSize: this.pageSize,
      },
      queryParamsHandling: 'merge',
    });

    this.getLastAddedBooks();
  }

  ngOnInit(): void {
    let urlParams = this.activatedRoute.snapshot.queryParams;

    if (urlParams['page'] != null) {
      this.currentPage = Number(urlParams['page']);
    }

    if (urlParams['pageSize'] != null) {
      this.pageSize = Number(urlParams['pageSize']);
    }

    this.getLastAddedBooks();
    this.getBooksCount();
    this.getReadersCount();
    this.getGenresCount();
  }

  getLastAddedBooks() {
    this.booksService
      .getLastAddedBooks(this.currentPage, this.pageSize)
      .subscribe({
        next: (data: any) => {
          this.loadedBooks = data.retrievedBooks;
          this.totalBooks = data['booksCount'];
          this.totalPages = Math.ceil(this.totalBooks / this.pageSize);

          if (this.totalBooks === 0) {
            this.descriptionInfoText =
              'No new books were added in the last 14 days.';
          }

          this.isGetBooksSuccessful = true;
        },
        error: (err) => {
          this.isGetBooksFailed = true;

          if (err.status == 404) {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Server error';
          }
        },
      });
  }

  public onGoTo(page: number): void {
    this.currentPage = page;
    this.navigateTo();
  }

  public onNext(page: number): void {
    this.currentPage = page + 1;
    this.navigateTo();
  }

  public onPrevious(page: number): void {
    this.currentPage = page - 1;
    this.navigateTo();
  }

  getBooksCount() {
    this.booksService.getBooksCount().subscribe({
      next: (data: number) => {
        this.booksCount = data;
      },
      error: (err) => {
        if (err.status == 404) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Server error';
        }
      },
    });
  }

  getReadersCount() {
    this.authService.getReadersCount().subscribe({
      next: (data: number) => {
        this.readersCount = data;
      },
      error: (err) => {
        if (err.status == 404) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Server error';
        }
      },
    });
  }

  getGenresCount() {
    this.genresService.getGenresCount().subscribe({
      next: (data: number) => {
        this.genresCount = data;
      },
      error: (err) => {
        if (err.status == 404) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Server error';
        }
      },
    });
  }

  isLoggedOut() {
    return this.authService.isLoggedOut();
  }
}

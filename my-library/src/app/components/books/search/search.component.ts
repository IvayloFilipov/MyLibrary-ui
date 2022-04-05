import { Component, OnInit } from '@angular/core';
import { BooksService } from 'src/app/services/books.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultBookCover } from 'src/app/components/books/defaultcover.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['../books.component.scss', './search.component.scss'],
})
export class SearchComponent implements OnInit {
  public isGetBooksSuccessful = false;
  public isGetBooksFailed = false;
  public errorMessage = '';

  public loadedBooks: any[] = [];

  public currentPage = 1;
  public pageSize = 12;
  public totalBooks = 0;

  defaultCover = DefaultBookCover.defaultCover;

  constructor(
    private booksService: BooksService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    let urlParams = this.activatedRoute.snapshot.queryParams;
    let hasPage = false;
    let hasPageSize = false;

    if (urlParams['title'] != null) {
      this.form.title = urlParams['title'];
    }
    if (urlParams['genre'] != null) {
      this.form.genre = urlParams['genre'];
    }
    if (urlParams['author'] != null) {
      this.form.author = urlParams['author'];
    }
    if (urlParams['description'] != null) {
      this.form.description = urlParams['description'];
    }

    if (urlParams['page'] != null) {
      this.currentPage = Number(urlParams['page']);
      hasPage = true;
    }
    if (urlParams['pageSize'] != null) {
      this.pageSize = Number(urlParams['pageSize']);
      hasPageSize = true;
    }

    if (hasPage && hasPageSize) {
      this.searchForBooks();
    }
  }

  title = '';
  genre = '';
  author = '';
  description = '';

  form: any = {
    title: null,
    genre: null,
    author: null,
    description: null,
  };

  navigateTo(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        title: this.form.title || null,
        author: this.form.author || null,
        genre: this.form.genre || null,
        description: this.form.description || null,
        page: this.currentPage,
        pageSize: this.pageSize,
      },
      queryParamsHandling: 'merge',
    });

    this.searchForBooks();
  }

  onSubmit(): void {
    this.navigateTo();
  }

  public searchForBooks() {
    let queryParams: string[] = [
      `page=${this.currentPage}`,
      `pageSize=${this.pageSize}`,
    ];
    Object.entries(this.form).forEach(([key, value]) => {
      if (value !== null && String(value).length > 0) {
        queryParams.push(`${key}=${encodeURIComponent(String(value))}`);
      }
    });

    this.booksService.searchBooks(queryParams.join('&')).subscribe({
      next: (data) => {
        this.loadedBooks = data.result;
        this.totalBooks = data.totalCount;
        this.total = Math.ceil(this.totalBooks / this.pageSize);

        if (this.loadedBooks.length > 0) {
          this.isGetBooksSuccessful = true;
          this.isGetBooksFailed = false;
        } else {
          if (this.currentPage === 1) {
            this.isGetBooksSuccessful = false;
            this.isGetBooksFailed = true;
            this.errorMessage = 'Invalid search';
          } else {
            this.currentPage = 1;
            this.navigateTo();
          }
        }
      },
      error: (err) => {
        this.isGetBooksSuccessful = false;
        this.isGetBooksFailed = true;
        if (err.status == 400) {
          this.errorMessage = 'Invalid search';
        } else if (err.status == 404) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Server error';
        }
      },
    });
  }

  public total = Math.ceil(this.totalBooks / this.pageSize);

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
}

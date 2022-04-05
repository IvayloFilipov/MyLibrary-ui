import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-bookreservationrequests',
  templateUrl: './bookreservationrequests.component.html',
  styleUrls: ['./bookreservationrequests.component.scss'],
})
export class BookReservationRequestsComponent implements OnInit {
  public isGetBooksReservationSuccessful = false;
  public isGetBooksReservationFailed = false;
  public errorMessage = '';

  public loadedBooksReservationRequests: any[] = [];

  public currentPage = 1;
  public pageSize = 10;
  public totalBookReservationRequests = 0;

  constructor(
    private booksService: BooksService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  navigateTo(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: this.currentPage,
        pageSize: this.pageSize,
      },
      queryParamsHandling: 'merge',
    });

    this.getBookReservations();
  }

  ngOnInit(): void {
    let urlParams = this.activatedRoute.snapshot.queryParams;
    let hasPage = false;
    let hasPageSize = false;

    if (urlParams['page'] != null) {
      this.currentPage = Number(urlParams['page']);
      hasPage = true;
    }

    if (urlParams['pageSize'] != null) {
      this.pageSize = Number(urlParams['pageSize']);
      hasPageSize = true;
    }

    if (hasPage && hasPageSize) {
      this.getBookReservations();
    } else {
      this.currentPage = 1;
      this.navigateTo();
    }
  }

  onSubmit(): void {
    this.navigateTo();
  }

  getBookReservations() {

    this.booksService.getBookReservations(this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.loadedBooksReservationRequests = data.result;
          this.totalBookReservationRequests = data.totalCount;
          this.total = Math.ceil(
            this.totalBookReservationRequests / this.pageSize
          );

          if (this.loadedBooksReservationRequests.length > 0) {
            this.isGetBooksReservationSuccessful = true;
            this.isGetBooksReservationFailed = false;
          } else {
            if (this.currentPage === 1) {
              this.isGetBooksReservationSuccessful = false;
              this.isGetBooksReservationFailed = true;
              this.errorMessage = 'Invalid search';
            } else {
              this.currentPage = 1;
              this.navigateTo();
            }
          }
        },
        error: (err) => {
          this.isGetBooksReservationSuccessful = false;
          this.isGetBooksReservationFailed = true;
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

  public total = Math.ceil(this.totalBookReservationRequests / this.pageSize);

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

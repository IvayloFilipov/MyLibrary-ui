import { Component, OnInit } from '@angular/core';
import { AuthorsService } from 'src/app/services/authors.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: [
    '../admin-menu/admin-menu.component.scss',
    './authors.component.scss',
  ],
})
export class AuthorsComponent implements OnInit {
  public isGetAuthorsSuccessful = false;
  public isGetAuthorsFailed = false;
  public errorMessage = '';

  public loadedAuthors: any[] = [];

  public currentPage = 1;
  public pageSize = 10;
  public totalAuthors = 0;

  constructor(
    private authorsService: AuthorsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  form: any = {
    authorName: null,
  };

  navigateTo(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        authorName: this.form.authorName || null,
        page: this.currentPage,
        pageSize: this.pageSize,
      },
      queryParamsHandling: 'merge',
    });

    this.searchForAuthors();
  }

  ngOnInit(): void {
    let urlParams = this.activatedRoute.snapshot.queryParams;
    let hasPage = false;
    let hasPageSize = false;

    if (urlParams['authorName'] != null) {
      this.form.authorName = urlParams['authorName'];
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
      this.searchForAuthors();
    } else {
      this.navigateTo();
    }
  }

  onSubmit(): void {
    this.navigateTo();
  }

  searchForAuthors() {
    let queryParams: string[] = [
      `page=${this.currentPage}`,
      `pageSize=${this.pageSize}`,
    ];
    Object.entries(this.form).forEach(([key, value]) => {
      if (value !== null && String(value).length > 0) {
        queryParams.push(`${key}=${encodeURIComponent(String(value))}`);
      }
    });

    this.authorsService.searchAuthors(queryParams.join('&')).subscribe({
      next: (data) => {
        this.loadedAuthors = data.result;
        this.totalAuthors = data.totalCount;
        this.total = Math.ceil(this.totalAuthors / this.pageSize);

        if (this.loadedAuthors.length > 0) {
          this.isGetAuthorsSuccessful = true;
          this.isGetAuthorsFailed = false;
        } else {
          if (this.currentPage === 1) {
            this.isGetAuthorsSuccessful = false;
            this.isGetAuthorsFailed = true;
            this.errorMessage = 'Invalid search';
          } else {
            this.currentPage = 1;
            this.navigateTo();
          }
        }
      },
      error: (err) => {
        this.isGetAuthorsSuccessful = false;
        this.isGetAuthorsFailed = true;
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

  getAuthors() {
    this.authorsService.getAuthors(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.loadedAuthors = data.result;
        this.totalAuthors = data.totalCount;
        this.total = Math.ceil(this.totalAuthors / this.pageSize);

        if (this.loadedAuthors.length > 0) {
          this.isGetAuthorsSuccessful = true;
          this.isGetAuthorsFailed = false;
        } else {
          if (this.currentPage === 1) {
            this.isGetAuthorsSuccessful = false;
            this.isGetAuthorsFailed = true;
            this.errorMessage = 'Invalid search';
          } else {
            this.currentPage = 1;
            this.navigateTo();
          }
        }
      },
      error: (err) => {
        this.isGetAuthorsSuccessful = false;
        this.isGetAuthorsFailed = true;
        if (err.status == 404) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Server error';
        }
      },
    });
  }

  getAllAuthors() {
    this.isGetAuthorsSuccessful = false;
    this.isGetAuthorsFailed = false;

    this.authorsService.getAllAuthors().subscribe({
      next: (data) => {
        this.loadedAuthors = data;
        this.isGetAuthorsSuccessful = true;
        this.onGoTo(1);
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

  public total = Math.ceil(this.totalAuthors / this.pageSize);

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

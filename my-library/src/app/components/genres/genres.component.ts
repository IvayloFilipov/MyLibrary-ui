import { Component, OnInit } from '@angular/core';
import { GenresService } from 'src/app/services/genres.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: [
    '../admin-menu/admin-menu.component.scss',
    './genres.component.scss',
  ],
})
export class GenresComponent implements OnInit {
  public isGetGenresSuccessful = false;
  public isGetGenresFailed = false;
  public errorMessage = '';

  public loadedGenres: any[] = [];

  public currentPage = 1;
  public pageSize = 10;
  public totalGenres = 0;

  constructor(
    private genresService: GenresService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  form: any = {
    name: null,
  };

  navigateTo(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        name: this.form.name || null,
        page: this.currentPage,
        pageSize: this.pageSize,
      },
      queryParamsHandling: 'merge',
    });

    this.searchForGenres();
  }

  ngOnInit(): void {
    let urlParams = this.activatedRoute.snapshot.queryParams;
    let hasPage = false;
    let hasPageSize = false;

    if (urlParams['name'] != null) {
      this.form.name = urlParams['name'];
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
      this.searchForGenres();
    } else {
      this.navigateTo();
    }
  }

  onSubmit(): void {
    this.navigateTo();
  }

  searchForGenres() {
    let queryParams: string[] = [
      `page=${this.currentPage}`,
      `pageSize=${this.pageSize}`,
    ];
    Object.entries(this.form).forEach(([key, value]) => {
      if (value !== null && String(value).length > 0) {
        queryParams.push(`${key}=${encodeURIComponent(String(value))}`);
      }
    });

    this.genresService.searchGenres(queryParams.join('&')).subscribe({
      next: (data) => {
        this.loadedGenres = data.result;
        this.totalGenres = data.totalCount;
        this.total = Math.ceil(this.totalGenres / this.pageSize);

        if (this.loadedGenres.length > 0) {
          this.isGetGenresSuccessful = true;
          this.isGetGenresFailed = false;
        } else {
          if (this.currentPage === 1) {
            this.isGetGenresSuccessful = false;
            this.isGetGenresFailed = true;
            this.errorMessage = 'Invalid search';
          } else {
            this.currentPage = 1;
            this.navigateTo();
          }
        }
      },
      error: (err) => {
        this.isGetGenresSuccessful = false;
        this.isGetGenresFailed = true;
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

  getGenres() {
    this.genresService.getGenres(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.loadedGenres = data.result;
        this.totalGenres = data.totalCount;
        this.total = Math.ceil(this.totalGenres / this.pageSize);

        if (this.loadedGenres.length > 0) {
          this.isGetGenresSuccessful = true;
          this.isGetGenresFailed = false;
        } else {
          if (this.currentPage === 1) {
            this.isGetGenresSuccessful = false;
            this.isGetGenresFailed = true;
            this.errorMessage = 'Invalid search';
          } else {
            this.currentPage = 1;
            this.navigateTo();
          }
        }
      },
      error: (err) => {
        this.isGetGenresSuccessful = false;
        this.isGetGenresFailed = true;
        if (err.status == 404) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Server error';
        }
      },
    });
  }

  getAllGenres() {
    this.isGetGenresSuccessful = false;
    this.isGetGenresFailed = false;

    this.genresService.getAllGenres().subscribe({
      next: (data) => {
        this.loadedGenres = data;
        this.isGetGenresSuccessful = true;
        this.onGoTo(1);
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

  public total = Math.ceil(this.totalGenres / this.pageSize);

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

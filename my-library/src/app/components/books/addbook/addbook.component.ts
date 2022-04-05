import { Component, OnInit } from '@angular/core';
import { BooksService } from 'src/app/services/books.service';
import { GenresService } from 'src/app/services/genres.service';
import { AuthorsService } from 'src/app/services/authors.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.component.html',
  styleUrls: [
    '../../admin-menu/admin-menu.component.scss',
    './addbook.component.scss',
  ],
})
export class AddbookComponent implements OnInit {
  constructor(
    private booksService: BooksService,
    private location: Location,
    private genresService: GenresService,
    private authorsService: AuthorsService
  ) {}

  ngOnInit(): void {
    this.getAllGenres();
    this.getAllAuthors();
  }

  onFileUpload(event: any) {
    const evTarget = event.target;
    const file: File = evTarget.files[0];

    if (this.formData.getAll('bookCover').length > 0) {
      this.formData.delete('bookCover');
    }

    if (evTarget.files && file) {
      // Maximum allowed size in bytes
      const maxAllowedSize = 512 * 1024;
      const allowedTypes = ['image/jpeg', 'image/png'];
      this.validFileSize = true;
      this.validFileFormat = true;

      if (!allowedTypes.includes(evTarget.files[0].type)) {
        this.validFileFormat = false;
      }

      if (evTarget.files[0].size > maxAllowedSize) {
        this.validFileSize = false;
      }

      if (this.validFileFormat && this.validFileSize) {
        this.formData.append('bookCover', file, file.name);
      } else {
        // Remove the uploaded file if it has the wrong format or if it's larger than the allowed size
        evTarget.value = '';
      }
    }
  }

  public formData = new FormData();

  public loadedGenres: any[] = [];
  public loadedAuthors: any[] = [];

  // maps the local data column to fields property
  public localFields: Object = { text: 'name' };
  // set the placeholder to MultiSelect Dropdown input element
  public localWaterMark: string = 'Select genre(s)';

  public isGetGenresSuccessful = false;
  public isGetGenresFailed = false;

  public localAuthorFields: Object = { text: 'authorName' };
  public localAuthorWaterMark: string = 'Select author(s)';

  public isGetAuthorsSuccessful = false;
  public isGetAuthorsFailed = false;

  title = '';
  description = '';
  quantity = '';

  errorMessage = '';
  isAdded = false;
  isFailed = false;

  validFileSize = true;
  validFileFormat = true;

  form: any = {
    title: null,
    authors: null,
    description: null,
    genres: null,
    quantity: null,
    cover: null,
  };

  onSubmit(): void {
    const { title, authors, description, genres, quantity } = this.form;

    let allParamsAPI = [
      'bookAuthors',
      'genres',
      'bookTitle',
      'description',
      'totalQuantity',
    ];

    for (let param of allParamsAPI) {
      if (this.formData.getAll(param).length > 0) {
        this.formData.delete(param);
      }
    }

    let allSingleParamsAPI = ['bookTitle', 'description', 'totalQuantity'];

    let allSingleParamsUI = [title, description, quantity];

    for (let author of authors) {
      this.formData.append('bookAuthors', author);
    }

    for (let genre of genres) {
      this.formData.append('genres', genre);
    }

    for (let i = 0; i < allSingleParamsUI.length; i++) {
      if (allSingleParamsUI[i] != null) {
        this.formData.append(allSingleParamsAPI[i], allSingleParamsUI[i]);
      }
    }

    this.booksService.addBook(this.formData).subscribe({
      next: (data) => {
        this.isAdded = true;
      },
      error: (err) => {
        this.isFailed = true;
        if (err.status == 400) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Server error';
        }
      },
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

  back(): void {
    this.location.back();
  }
}

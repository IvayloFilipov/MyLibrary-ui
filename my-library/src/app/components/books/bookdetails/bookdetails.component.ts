import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';
import { GenresService } from 'src/app/services/genres.service';
import { Location } from '@angular/common';
import { AuthorsService } from 'src/app/services/authors.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-bookdetails',
  templateUrl: './bookdetails.component.html',
  styleUrls: [
    '../../admin-menu/admin-menu.component.scss',
    './bookdetails.component.scss',
  ],
})
export class BookdetailsComponent implements OnInit {
  public id: any;
  public loadedBook: any;

  constructor(
    private booksService: BooksService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private genresService: GenresService,
    private authorsService: AuthorsService,
    private modalService: ModalService
  ) {
    this.id = this.activatedRoute.snapshot.params['bookId'];
  }

  ngOnInit(): void {
    this.getBook().then(() => {
      this.getAllGenres();
      this.getAllAuthors();
    });
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

      this.form.deleteCover = false;
    }
  }

  deleteUploadedCover() {
    if (this.form.deleteCover) {
      if (this.formData.getAll('bookCover').length > 0) {
        this.formData.delete('bookCover');
      }
      this.form.cover = '';
    }
  }

  public formData = new FormData();

  public loadedGenres: any[] = [];
  public loadedAuthors: any[] = [];
  public imageURL = null;

  // maps the local data column to fields property
  public localFields: Object = { text: 'name', value: 'name' };
  // set the placeholder to MultiSelect Dropdown input element
  public localWaterMark: string = 'Select genre(s)';

  public isGetGenresSuccessful = false;
  public isGetGenresFailed = false;

  public localAuthorFields: Object = {
    text: 'authorName',
    value: 'authorName',
  };
  public localAuthorWaterMark: string = 'Select author(s)';

  public isGetAuthorsSuccessful = false;
  public isGetAuthorsFailed = false;

  public defaultGenres: string[] = [];
  public defaultAuthors: string[] = [];

  title = '';
  errorMessage = '';
  deletingMsg = 'Loading...';
  isUpdated = false;
  isGetFailed = false;
  isUpdateFailed = false;
  isInConfirmProcess = false;
  isInUpdateProcess = false;
  isTryingToDelete = false;
  isShowingOperations = false;

  quantityMatch = false;

  validFileSize = true;
  validFileFormat = true;

  form: any = {
    title: null,
    authors: null,
    description: null,
    genres: null,
    availability: null,
    quantity: null,
    deleteCover: false,
  };

  onSubmit(): void {
    this.isInUpdateProcess = false;
    this.isInConfirmProcess = false;

    const {
      title,
      authors,
      description,
      genres,
      availability,
      quantity,
      deleteCover,
    } = this.form;

    if (
      genres.length == 0 ||
      title.length == 0 ||
      authors.length == 0 ||
      quantity.length == 0
    ) {
      return;
    }

    let allParamsAPI = [
      'bookAuthors',
      'genres',
      'bookTitle',
      'description',
      'totalQuantity',
      'availability',
      'deleteCover',
    ];

    for (let param of allParamsAPI) {
      if (this.formData.getAll(param).length > 0) {
        this.formData.delete(param);
      }
    }

    let allSingleParamsAPI = [
      'bookTitle',
      'description',
      'totalQuantity',
      'availability',
      'deleteCover',
    ];

    let allSingleParamsUI = [
      title,
      description,
      quantity,
      availability,
      deleteCover,
    ];

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

    this.booksService.updateBook(this.id, this.formData).subscribe({
      next: (data) => {
        this.isUpdated = true;
      },
      error: (err) => {
        this.isUpdateFailed = true;
        if (err.status == 400 || err.status == 404) {
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

  async getBook(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.booksService.getBook(this.id).subscribe({
        next: (data) => {
          this.loadedBook = data;
          this.isShowingOperations = true;
          this.form.title = this.loadedBook.title;
          this.form.description = this.loadedBook.description;
          this.form.availability = this.loadedBook.isAvailable;
          this.form.quantity = this.loadedBook.totalQuantity;
          this.imageURL = data.imageAddress;
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

  deleteBook() {
    this.isInUpdateProcess = false;
    this.isInConfirmProcess = false;
    this.isTryingToDelete = true;
    this.booksService.deleteBook(this.id).subscribe({
      next: (data) => {
        this.deletingMsg = `Book '${this.loadedBook.title}' deleted successfully.`;
      },
      error: (err) => {
        if (err.status == 404) {
          this.deletingMsg = err.error;
        } else {
          this.deletingMsg = 'Server error';
        }
      },
    });
  }

  getAllGenres() {
    this.isGetGenresFailed = false;

    this.genresService.getAllGenres().subscribe({
      next: (data) => {
        this.loadedGenres = data;
        this.defaultGenres = this.loadedBook.allGenres.split(', ');
        this.form.genres = this.defaultGenres;
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
        this.defaultAuthors = this.loadedBook.allAuthors.split(', ');
        this.form.authors = this.defaultAuthors;
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

  compareBookQuantity() {
    this.booksService.compareBookQuantity(this.id).subscribe({
      next: (data) => {
        this.quantityMatch = data;
      },
    });
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenresService } from 'src/app/services/genres.service';
import { BooksService } from 'src/app/services/books.service';
import { Location } from '@angular/common';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-genredetails',
  templateUrl: './genredetails.component.html',
  styleUrls: [
    '../../admin-menu/admin-menu.component.scss',
    './genredetails.component.scss',
  ],
})
export class GenredetailsComponent implements OnInit {
  public id: any;
  public loadedGenre: any;

  constructor(
    private genresService: GenresService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) {
    this.id = this.activatedRoute.snapshot.params['genreId'];
  }

  ngOnInit(): void {
    this.getGenre();
  }

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
  booksForGenre = -1;

  form: any = {
    title: null,
  };

  onSubmit(): void {
    this.isInUpdateProcess = false;
    this.isInConfirmProcess = false;
    const title = this.form.title;
    this.genresService.updateGenre(this.id, title).subscribe({
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

  getGenre() {
    this.genresService.getGenre(this.id).subscribe({
      next: (data) => {
        this.loadedGenre = data;
        this.isShowingOperations = true;
        this.form.title = this.loadedGenre.name;
      },
      error: (err) => {
        this.isGetFailed = true;
        if (err.status == 404) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Server error';
        }
      },
    });
  }

  deleteGenre() {
    this.isInUpdateProcess = false;
    this.isInConfirmProcess = false;
    this.isTryingToDelete = true;
    this.genresService.deleteGenre(this.id).subscribe({
      next: (data) => {
        this.deletingMsg = `Genre '${this.loadedGenre.name}' deleted successfully.`;
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

  checkGenreBooksNumber() {
    this.genresService.getBooksNumberForGenre(this.id).subscribe({
      next: (data) => {
        this.booksForGenre = data;
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthorsService } from 'src/app/services/authors.service';
import { BooksService } from 'src/app/services/books.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-authordetails',
  templateUrl: './authorDetails.component.html',
  styleUrls: [
    '../../admin-menu/admin-menu.component.scss',
    './authorDetails.component.scss',
  ],
})
export class AuthorDetailsComponent implements OnInit {
  public id: any;
  public loadedAuthor: any;

  constructor(
    private authorsService: AuthorsService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) {
    this.id = this.activatedRoute.snapshot.params['authorId'];
  }

  ngOnInit(): void {
    this.getAuthor();
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
  booksForAuthor = -1;

  form: any = {
    title: null,
  };

  onSubmit(): void {
    this.isInUpdateProcess = false;
    this.isInConfirmProcess = false;
    const title = this.form.title;
    this.authorsService.updateAuthor(this.id, title).subscribe({
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

  getAuthor() {
    this.authorsService.getAuthor(this.id).subscribe({
      next: (data) => {
        this.loadedAuthor = data;
        this.isShowingOperations = true;
        this.form.title = this.loadedAuthor.authorName;
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

  deleteAuthor() {
    this.isInUpdateProcess = false;
    this.isInConfirmProcess = false;
    this.isTryingToDelete = true;
    this.authorsService.deleteAuthor(this.id).subscribe({
      next: (data) => {
        this.deletingMsg = `Author '${this.loadedAuthor.authorName}' deleted successfully.`;
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

  checkAuthorBooksNumber() {
    this.authorsService.getBooksNumberForAuthor(this.id).subscribe({
      next: (data) => {
        this.booksForAuthor = data;
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

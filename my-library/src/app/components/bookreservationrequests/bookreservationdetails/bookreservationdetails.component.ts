import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';
import { ModalService } from 'src/app/services/modal.service';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bookreservationdetails',
  templateUrl: './bookreservationdetails.component.html',
  styleUrls: [
    '../../admin-menu/admin-menu.component.scss',
    './bookreservationdetails.component.scss',
  ],
})

export class BookReservationDetailsComponent implements OnInit {
  public bookReservationId: any;
  public librarianId: any;

  public loadedBookReservationRequest: any;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private booksService: BooksService,
    private modalService: ModalService,
    private userService: UserService
  ) { 
    this.bookReservationId = this.activatedRoute.snapshot.params['bookReservationId'];
    this.librarianId = this.userService.getUserId();
  }

  ngOnInit(): void {
    this.getBookReservationDetails();
  }

  isRejected = false;
  isApproved = false;
  isRejectFailed = false;
  isApproveFailed = false;
  rejectingMsg = 'Loading...';
  approvingMsg = 'Loading...';
  errorMessage = '';
  isUpdateFailed = false;
  isGetFailed = false;
  isInConfirmProcess = false;
  isInRejectProcess = false;
  isInApproveProcess = false;
  isTryingToReject = false;
  isTryingToApprove = false;
  isShowingOperations = false;

  form: any = {
    message: null,
  };

  back(): void {
    this.location.back();
  }
  
  rejectBookReservationRequest(): void {
    this.isInRejectProcess = true;
    const message = this.form.message;
      this.booksService.rejectBookReservation(this.bookReservationId, this.librarianId, message).subscribe({
        next: (data) => {
          this.isRejected = true;
          this.isTryingToReject = true;
          this.rejectingMsg = `The request has been rejected.`;
        },
        error: (err) => {
          if (err.status === 400 || err.status === 404) {
            this.isUpdateFailed = true;
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Server error';
          }
        },
      });
  }

  approveBookReservationRequest(): void {
    this.isInApproveProcess = true;
    const message = this.form.message;

    this.booksService.approveBookReservation(this.bookReservationId, this.librarianId, message).subscribe({
      next: (data) => {
        this.isApproved = true;
        this.isTryingToApprove = true;
        this.approvingMsg = 'The request has been approved.';
      },
      error: (err) => {
        if (err.status === 400 || err.status === 404) {
          this.isUpdateFailed = true;
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Server error';
        }
      },
    });
  }

  getBookReservationDetails() {
    this.booksService.getBookReservationDetails(this.bookReservationId).subscribe({
      next: (data) => {
        this.loadedBookReservationRequest = data;
        this.isShowingOperations = true;
        this.form.message = this.loadedBookReservationRequest.message;
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

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}


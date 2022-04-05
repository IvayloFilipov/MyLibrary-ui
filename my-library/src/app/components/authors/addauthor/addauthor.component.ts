import { Component, OnInit } from '@angular/core';
import { AuthorsService } from 'src/app/services/authors.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-addauthor',
  templateUrl: './addauthor.component.html',
  styleUrls: [
    '../../admin-menu/admin-menu.component.scss',
    './addauthor.component.scss']
})
export class AddAuthorComponent implements OnInit {

  title = '';
  errorMessage = '';
  isAdded = false;
  isFailed = false;

  constructor(
    private authorsService : AuthorsService,
    private location: Location
  ) { }

  ngOnInit(): void {}

  form: any = {
    title: null,
  };

  onSubmit(): void {
    const title = this.form.title;
    this.authorsService.addAuthor(title).subscribe({
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

  back(): void {
    this.location.back();
  }
}

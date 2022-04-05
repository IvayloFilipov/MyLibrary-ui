import { Component, OnInit } from '@angular/core';
import { GenresService } from 'src/app/services/genres.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-addgenre',
  templateUrl: './addgenre.component.html',
  styleUrls: [
    '../../admin-menu/admin-menu.component.scss',
    './addgenre.component.scss',
  ],
})
export class AddgenreComponent implements OnInit {
  ngOnInit(): void {}

  title = '';
  errorMessage = '';
  isAdded = false;
  isFailed = false;

  constructor(
    private genresService: GenresService,
    private location: Location
  ) {}

  form: any = {
    title: null,
  };

  onSubmit(): void {
    const title = this.form.title;
    this.genresService.addGenre(title).subscribe({
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

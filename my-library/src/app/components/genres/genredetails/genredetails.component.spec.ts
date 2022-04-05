import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenredetailsComponent } from './genredetails.component';

describe('GenredetailsComponent', () => {
  let component: GenredetailsComponent;
  let fixture: ComponentFixture<GenredetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenredetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenredetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

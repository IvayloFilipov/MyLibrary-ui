import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReservationDetailsComponent } from './bookreservationdetails.component';

describe('BookreservationdetailsComponent', () => {
  let component: BookReservationDetailsComponent;
  let fixture: ComponentFixture<BookReservationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookReservationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookReservationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

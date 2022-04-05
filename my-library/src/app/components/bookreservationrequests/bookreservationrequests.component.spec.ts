import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookReservationRequestsComponent } from './bookreservationrequests.component';

describe('BookreservationrequestsComponent', () => {
  let component: BookReservationRequestsComponent;
  let fixture: ComponentFixture<BookReservationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookReservationRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookReservationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

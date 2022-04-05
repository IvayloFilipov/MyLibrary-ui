import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderBookDetailsComponent } from './readerbookdetails.component';

describe('ReaderBookDetailsComponent', () => {
  let component: ReaderBookDetailsComponent;
  let fixture: ComponentFixture<ReaderBookDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReaderBookDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderBookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

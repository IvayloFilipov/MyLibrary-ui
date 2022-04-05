import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorDetailsComponent } from './authorDetails.component';

describe('AuthordetailsComponent', () => {
  let component: AuthorDetailsComponent;
  let fixture: ComponentFixture<AuthorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

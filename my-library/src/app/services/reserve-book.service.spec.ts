import { TestBed } from '@angular/core/testing';

import { ReserveBookService } from './reserve-book.service';

describe('ReserveBookService', () => {
  let service: ReserveBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReserveBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

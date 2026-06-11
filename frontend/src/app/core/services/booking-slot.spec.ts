import { TestBed } from '@angular/core/testing';

import { BookingSlot } from './booking-slot';

describe('BookingSlot', () => {
  let service: BookingSlot;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingSlot);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

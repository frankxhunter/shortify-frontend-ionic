import { TestBed } from '@angular/core/testing';

import { RelativeTime } from './relative-time';

describe('RelativeTime', () => {
  let service: RelativeTime;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelativeTime);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

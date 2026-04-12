import { TestBed } from '@angular/core/testing';

import { UrlStrategy } from './url-strategy';

describe('UrlStrategy', () => {
  let service: UrlStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlStrategy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

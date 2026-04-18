import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { homeResolverResolver } from './home-resolver';

describe('homeResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => homeResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});

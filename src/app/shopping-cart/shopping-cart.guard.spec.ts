import { TestBed } from '@angular/core/testing';

import { ShoppingCartGuard } from './shopping-cart.guard';

describe('ShoppingCartGuard', () => {
  let guard: ShoppingCartGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ShoppingCartGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

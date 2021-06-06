import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthguardService } from './authguard.service';

describe('AuthguardService', () => {
  let authguardService: AuthguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthguardService],
    });
    authguardService = TestBed.inject(AuthguardService);
  });

  it('should be created', () => {
    expect(authguardService).toBeTruthy();
  });

  it('should return true for a logged user', () => {
    // TODO
  });

  it('should return false for a non logged user', () => {
    // TODO
  });
});

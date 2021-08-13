import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import { AccountService } from './account.service';

describe('AccountService', () => {
  let accountService: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [AccountService],
    });
    accountService = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(accountService).toBeTruthy();
  });
});

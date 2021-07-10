import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { fakeAsync, TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';

describe('AccountService', () => {
  let accountService: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccountService],
    });
    accountService = TestBed.inject(AccountService);
  });

  let httpTestingController: HttpTestingController;
  beforeEach(
    () => (httpTestingController = TestBed.get(HttpTestingController))
  );

  beforeEach(() => (accountService = TestBed.get(AccountService)));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(accountService).toBeTruthy();
  });

  it('should register', fakeAsync(() => {
    // TODO
  }));

  it('should login', fakeAsync(() => {
    // TODO
  }));

  it('should logout user', fakeAsync(() => {
    //TODO
  }));

  it('should store token', () => {
    accountService.storeToken('testToken');
    expect(localStorage.getItem('token')).toEqual('testToken');

    localStorage.removeItem('token');
  });
});

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { AccountManagerComponent } from './account-manager.component';
import { routes } from '../../../app-routing.module';
import { User } from '../../models/user.model';

describe('AccountManagerComponent', () => {
  let component: AccountManagerComponent;
  let fixture: ComponentFixture<AccountManagerComponent>;
  let user = new User(1, 'John', 'Doe', 'johndoe@gmail.com');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [AccountManagerComponent],
    }).compileComponents();
    localStorage.setItem(
      'user',
      '{"id":1,"firstName":"test","lastName":"test","email":"test@test.com"}'
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountManagerComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get forms control', () => {
    expect(component.accountForm).toEqual(component.editAccountForm.controls);
    expect(component.passwordForm).toEqual(
      component.changePasswordForm.controls
    );
  });

  it('should go back to the dashboard', fakeAsync(() => {
    spyOn(component, 'onBack');

    let backButton =
      fixture.debugElement.nativeElement.querySelector('#backBtn');

    backButton.click();

    tick();
    expect(component.onBack).toHaveBeenCalled();
  }));

  it('should submit forms', fakeAsync(() => {
    spyOn(component, 'onEditAccountSubmit');
    spyOn(component, 'onEditPasswordSubmit');

    let editButton =
      fixture.debugElement.nativeElement.querySelector('#edit-btn');
    let pwdButton =
      fixture.debugElement.nativeElement.querySelector('#pwd-btn');

    editButton.click();
    pwdButton.click();

    tick();
    expect(component.onEditAccountSubmit).toHaveBeenCalled();
    expect(component.onEditPasswordSubmit).toHaveBeenCalled();
  }));
});

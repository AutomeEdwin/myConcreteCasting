import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJobsiteComponent } from './new-jobsite.component';

describe('NewJobsiteComponent', () => {
  let component: NewJobsiteComponent;
  let fixture: ComponentFixture<NewJobsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewJobsiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewJobsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

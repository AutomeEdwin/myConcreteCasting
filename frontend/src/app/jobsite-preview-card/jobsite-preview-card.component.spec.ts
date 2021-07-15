import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsitePreviewCardComponent } from './jobsite-preview-card.component';

describe('JobsitePreviewCardComponent', () => {
  let component: JobsitePreviewCardComponent;
  let fixture: ComponentFixture<JobsitePreviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsitePreviewCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsitePreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

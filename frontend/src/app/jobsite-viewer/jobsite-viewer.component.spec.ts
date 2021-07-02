import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsiteViewerComponent } from './jobsite-viewer.component';

describe('JobsiteViewerComponent', () => {
  let component: JobsiteViewerComponent;
  let fixture: ComponentFixture<JobsiteViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsiteViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsiteViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

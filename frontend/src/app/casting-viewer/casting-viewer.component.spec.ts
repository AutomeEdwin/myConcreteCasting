import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastingViewerComponent } from './casting-viewer.component';

describe('CastingViewerComponent', () => {
  let component: CastingViewerComponent;
  let fixture: ComponentFixture<CastingViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CastingViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CastingViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

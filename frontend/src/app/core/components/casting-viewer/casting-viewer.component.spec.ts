import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CastingViewerComponent } from './casting-viewer.component';
import { Casting } from '../../models/casting.model';
import { Subscription } from 'rxjs';

describe('CastingViewerComponent', () => {
  let component: CastingViewerComponent;
  let fixture: ComponentFixture<CastingViewerComponent>;
  let today = new Date();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CastingViewerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CastingViewerComponent);
    component = fixture.componentInstance;
    component.casting = new Casting(
      'fqs4d56f4qds65f',
      'name',
      'description',
      true,
      0.2,
      false,
      0.2,
      'oversulfated cement',
      '',
      ''
    );

    component.subscription = new Subscription();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start curing', fakeAsync(() => {
    component.casting = new Casting(
      'fqs4d56f4qds65f',
      'name',
      'description',
      true,
      0.2,
      false,
      0.2,
      'oversulfated cement',
      today,
      new Date(today.getTime() + 1)
    );

    spyOn(component, 'onStartCuring');

    let startBtn =
      fixture.debugElement.nativeElement.querySelector('#startCuring');
    startBtn.click();

    tick();
    expect(component.onStartCuring).toHaveBeenCalled();
  }));

  it('should unsubscribe when destroyed', () => {
    fixture.detectChanges();

    component.ngOnDestroy();

    expect(component.subscription.unsubscribe).toBeTruthy();
  });

  it('should set Time Units', () => {
    component.casting = new Casting(
      'fqs4d56f4qds65f',
      'name',
      'description',
      true,
      0.2,
      false,
      0.2,
      'oversulfated cement',
      today,
      new Date(today.getTime() + 1)
    );

    let beginning = new Date().getTime();
    let ending = new Date(component.casting.getCuringEndDate()).getTime();
    let seconds = Math.floor(((ending - beginning) / 1000) % 60);
    let minutes = Math.floor(((ending - beginning) / (1000 * 60)) % 60);
    let hours = Math.floor(((ending - beginning) / (1000 * 60 * 60)) % 24);
    let days = Math.floor((ending - beginning) / (1000 * 60 * 60 * 24));

    component.setTimeUnits();

    setTimeout(() => {}, 1000);

    expect(component.seconds).toEqual(seconds);
    expect(component.minutes).toEqual(minutes);
    expect(component.hours).toEqual(hours);
    expect(component.days).toEqual(days);
  });
});

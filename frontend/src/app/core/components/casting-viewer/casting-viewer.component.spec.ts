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
      'CEM 52.5 N',
      'C20_25',
      1629669600,
      43200,
      1630101
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
      'CEM 52.5 N',
      'C20_25',
      1629669600,
      43200,
      1630101
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
      'CEM 52.5 N',
      'C20_25',
      1629669600,
      43200,
      1630101
    );

    let curingEnding =
      component.casting.getCuringStartDate() +
      component.casting.getCuringDuration();
    let hardeningEnding =
      component.casting.getCuringStartDate() +
      component.casting.getHardeningDuration();

    let curingRemainingTime = curingEnding - new Date().getTime() / 1000;
    let hardeningRemainingTime = hardeningEnding - new Date().getTime() / 1000;

    let curinghours = Math.floor((curingRemainingTime / (60 * 60)) % 24);
    let curingdays = Math.floor(curingRemainingTime / (60 * 60 * 24));

    let hardeninghours = Math.floor((hardeningRemainingTime / (60 * 60)) % 24);
    let hardeningdays = Math.floor(hardeningRemainingTime / (60 * 60 * 24));

    component.setTimeUnits();

    setTimeout(() => {}, 1000);
    expect(component.curinghours).toEqual(curinghours);
    expect(component.curingdays).toEqual(curingdays);
    expect(component.hardeninghours).toEqual(hardeninghours);
    expect(component.hardeningdays).toEqual(hardeningdays);
  });
});

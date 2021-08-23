import { Casting } from './casting.model';

describe('Casting', () => {
  const testCasting = new Casting(
    'fqs4d56f4qds65f',
    'name',
    'description',
    true,
    0.2,
    false,
    0.2,
    'oversulfated cement',
    'C20_25',
    new Date().getTime(),
    new Date().getTime(),
    new Date().getTime()
  );

  const today = new Date();
  const tomorrow = new Date();
  const yesterday = new Date();
  tomorrow.setDate(today.getDate() + 1);
  yesterday.setDate(today.getDate() - 1);

  it('should create an instance', () => {
    expect(testCasting).toBeTruthy();
  });

  it('should update the curing starting date', () => {
    testCasting.setCuringStartDate(new Date().getTime());

    expect(testCasting.getCuringStartDate()).toEqual(new Date().getTime());
  });

  it('should update the curing ending date', () => {
    testCasting.setCuringDuration(43200);

    expect(testCasting.getCuringDuration()).toEqual(43200);
  });

  it('should know if curing is still in progress', () => {
    let casting = new Casting(
      'fqs4d56f4qds65f',
      'name',
      'description',
      true,
      0.2,
      false,
      0.2,
      'oversulfated cement',
      'C20_25',
      yesterday.getTime(),
      tomorrow.getTime(),
      tomorrow.getTime() + 43200
    );

    expect(casting.isCuringInProgress()).toBeTruthy();
  });

  it('should know if curing is finished', () => {
    let casting = new Casting(
      'fqs4d56f4qds65f',
      'name',
      'description',
      true,
      0.2,
      false,
      0.2,
      'oversulfated cement',
      'C20_25',
      yesterday.getTime(),
      tomorrow.getTime(),
      tomorrow.getTime() + 43200
    );
    expect(casting.isCuringFinished()).toBeFalse();
  });
});

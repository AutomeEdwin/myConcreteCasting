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
    new Date(),
    new Date()
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
    testCasting.setCuringStartDate(new Date());

    expect(testCasting.getCuringStartDate()).toEqual(new Date());
  });

  it('should update the curing ending date', () => {
    testCasting.setCuringEndDate(tomorrow);

    expect(testCasting.getCuringEndDate()).toEqual(tomorrow);
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
      yesterday,
      tomorrow
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
      yesterday,
      tomorrow
    );
    expect(casting.isCuringFinished()).toBeFalse();
  });
});

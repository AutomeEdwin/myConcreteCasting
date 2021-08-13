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
  it('should create an instance', () => {
    expect(testCasting).toBeTruthy();
  });

  it('should update the curing starting date', () => {
    testCasting.setCuringStartDate(new Date());

    expect(testCasting.getCuringStartDate()).toEqual(new Date());
  });

  it('should update the curing ending date', () => {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    testCasting.setCuringEndDate(tomorrow);

    expect(testCasting.getCuringEndDate()).toEqual(tomorrow);
  });
});

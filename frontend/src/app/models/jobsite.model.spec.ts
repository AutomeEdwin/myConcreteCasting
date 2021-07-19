import { Casting } from './casting.model';
import { Jobsite } from './jobsite.model';

describe('Jobsite', () => {
  it('should create an instance', () => {
    let castingsArray: Array<Casting> = [
      new Casting('name', 'description', 'infos'),
    ];
    let jobsite = new Jobsite(
      1,
      'owner',
      'name',
      'address',
      [0, 0],
      'description',
      castingsArray
    );
    expect(jobsite).toBeTruthy();
  });
});

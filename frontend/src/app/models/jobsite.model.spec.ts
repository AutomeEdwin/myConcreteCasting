import { Jobsite } from './jobsite.model';

describe('Jobsite', () => {
  it('should create an instance', () => {
    expect(
      new Jobsite(
        1,
        'owner',
        'name',
        'address',
        [0, 0],
        'description',
        'castings'
      )
    ).toBeTruthy();
  });
});

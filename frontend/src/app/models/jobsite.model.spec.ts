import { Jobsite } from './jobsite.model';

describe('Jobsite', () => {
  it('should create an instance', () => {
    expect(
      new Jobsite(
        1,
        'owner',
        'name',
        'address',
        'coordinates',
        'description',
        'castings'
      )
    ).toBeTruthy();
  });
});

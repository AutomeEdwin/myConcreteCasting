import { Casting } from './casting.model';

describe('Casting', () => {
  it('should create an instance', () => {
    expect(new Casting('name', 'description', 'infos')).toBeTruthy();
  });
});

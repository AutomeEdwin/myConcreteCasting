import { Weather } from './weather.model';

describe('Weather', () => {
  it('should create an instance', () => {
    expect(new Weather('clear sky', '01d', 7, 100, 1, 1.5)).toBeTruthy();
  });
});

import { User } from './user.model';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User(1, 'John', 'Doe', 'johndoe@gmail.com')).toBeTruthy();
  });
});

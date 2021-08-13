import { User } from './user.model';

describe('User', () => {
  const user = new User(1, 'John', 'Doe', 'johndoe@gmail.com');
  it('should create an instance', () => {
    expect(user).toBeTruthy();
  });

  it('should get all User informations', () => {
    expect(user.getID()).toEqual(1);
    expect(user.getFirstName()).toEqual('John');
    expect(user.getLastName()).toEqual('Doe');
    expect(user.getEmail()).toEqual('johndoe@gmail.com');
  });
});

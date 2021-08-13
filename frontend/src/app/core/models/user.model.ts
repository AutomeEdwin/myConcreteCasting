export class User {
  constructor(
    private id: number,
    private firstName: string,
    private lastName: string,
    private email: string
  ) {}

  getID() {
    return this.id;
  }

  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  getEmail() {
    return this.email;
  }
}

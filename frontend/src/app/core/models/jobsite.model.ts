import { Casting } from './casting.model';

export class Jobsite {
  constructor(
    private id: number,
    private owner: number,
    private name: string,
    private address: string,
    private coordinates: Array<number>,
    private description: string,
    private castings: Array<Casting>
  ) {}

  getId() {
    return this.id;
  }

  getOwner() {
    return this.owner;
  }

  getName() {
    return this.name;
  }

  getAddress() {
    return this.address;
  }

  getCoordinates() {
    return this.coordinates;
  }

  getDescription() {
    return this.description;
  }

  getCastings() {
    return this.castings;
  }
}

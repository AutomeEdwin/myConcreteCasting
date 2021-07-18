export class Jobsite {
  constructor(
    private id: number,
    private jobsite_owner: string,
    private jobsite_name: string,
    private jobsite_address: string,
    private jobsite_coordinates: Array<number>,
    private jobsite_description: string,
    private jobsite_castings: string
  ) {}

  getId() {
    return this.id;
  }

  getOwner() {
    return this.jobsite_owner;
  }

  getName() {
    return this.jobsite_name;
  }

  getAddress() {
    return this.jobsite_address;
  }

  getCoordinates() {
    return this.jobsite_coordinates;
  }

  getDescription() {
    return this.jobsite_description;
  }

  getCastings() {
    return this.jobsite_castings;
  }
}

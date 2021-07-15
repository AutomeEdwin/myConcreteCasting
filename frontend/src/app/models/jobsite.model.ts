export class Jobsite {
  constructor(
    public id: number,
    public jobsite_owner: string,
    public jobsite_name: string,
    public jobsite_address: string,
    public jobsite_coordinates: string,
    public jobsite_description: string,
    public jobsite_castings: string
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

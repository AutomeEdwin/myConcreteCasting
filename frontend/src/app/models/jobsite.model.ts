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
}

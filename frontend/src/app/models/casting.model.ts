export class Casting {
  constructor(
    private casting_name: string,
    private casting_description: string,
    private casting_infos: string
  ) {}

  getName() {
    return this.casting_name;
  }

  getDescrition() {
    return this.casting_description;
  }

  getInfos() {
    return this.casting_infos;
  }
}

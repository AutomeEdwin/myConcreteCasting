export class Casting {
  constructor(
    private casting_uuid: string,
    private name: string,
    private description: string,
    private isClassEI: boolean,
    private fcm2_fcm28_ratio: number,
    private type2_addition: boolean,
    private rc2_rc28_ratio: number,
    private cement_type: string,
    private curing_start: Date | string,
    private curing_end: Date | string
  ) {}

  getUUID() {
    return this.casting_uuid;
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  getIsClassEI() {
    return this.isClassEI;
  }

  getfcm2_fcm28_ratio() {
    return this.fcm2_fcm28_ratio;
  }

  getType2Addition() {
    return this.type2_addition;
  }

  getrc2_rc28_ratio() {
    return this.rc2_rc28_ratio;
  }

  getCementType() {
    return this.cement_type;
  }

  getCuringStartDate() {
    return this.curing_start;
  }

  getCuringEndDate() {
    return this.curing_end;
  }

  setCuringStartDate(x: Date) {
    this.curing_start = x;
  }

  setCuringEndDate(x: Date) {
    this.curing_end = x;
  }
}

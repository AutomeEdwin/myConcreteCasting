export class Casting {
  constructor(
    private casting_uuid: string,
    private casting_name: string,
    private casting_description: string,
    private casting_isClassEI: boolean,
    private casting_fcm2_fcm28_ratio: number,
    private casting_type2_addition: boolean,
    private casting_rc2_rc28_ratio: number,
    private casting_cement_type: string,
    private casting_curing_start: Date | string,
    private casting_curing_end: Date | string
  ) {}

  getUUID() {
    return this.casting_uuid;
  }

  getName() {
    return this.casting_name;
  }

  getDescription() {
    return this.casting_description;
  }

  getIsClassEI() {
    return this.casting_isClassEI;
  }

  getfcm2_fcm28_ratio() {
    return this.casting_fcm2_fcm28_ratio;
  }

  getType2Addition() {
    return this.casting_type2_addition;
  }

  getrc2_rc28_ratio() {
    return this.casting_rc2_rc28_ratio;
  }

  getCementType() {
    return this.casting_cement_type;
  }

  getCuringStartDate() {
    return this.casting_curing_start;
  }

  getCuringEndDate() {
    return this.casting_curing_end;
  }

  setCuringStartDate(x: Date) {
    this.casting_curing_start = x;
  }

  setCuringEndDate(x: Date) {
    this.casting_curing_end = x;
  }
}

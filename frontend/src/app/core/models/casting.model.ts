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
    private strength_class: string,
    private curing_start: number,
    private curing_duration: number
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

  getStrengthClass() {
    return this.strength_class;
  }

  getCuringStartDate() {
    return this.curing_start;
  }

  getCuringDuration() {
    return this.curing_duration;
  }

  setCuringStartDate(x: number) {
    this.curing_start = x;
  }

  setCuringDuration(x: number) {
    this.curing_duration = x;
  }

  isCuringInProgress() {
    return (
      new Date().getTime() / 1000 <
      this.getCuringStartDate() + this.getCuringDuration()
    );
  }

  isCuringFinished() {
    return (
      this.getCuringStartDate() + this.getCuringDuration() <
      new Date().getTime() / 1000
    );
  }
}

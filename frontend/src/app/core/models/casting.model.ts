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
    private target_strength: number,
    private casting_start: number,
    private curing_duration: number,
    private hardening_duration: number
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

  getTargetStrength() {
    return this.target_strength;
  }

  getCuringStartDate() {
    return this.casting_start;
  }

  getCuringDuration() {
    return this.curing_duration;
  }

  getHardeningDuration() {
    return this.hardening_duration;
  }

  setTargetStrength(x: number) {
    this.target_strength = x;
  }

  setCuringStartDate(x: number) {
    this.casting_start = x;
  }

  setCuringDuration(x: number) {
    this.curing_duration = x;
  }

  setHardeningDuration(x: number) {
    this.hardening_duration = x;
  }

  isCuringInProgress() {
    return (
      new Date().getTime() / 1000 < this.casting_start + this.curing_duration
    );
  }

  isCuringFinished() {
    return (
      this.casting_start + this.curing_duration < new Date().getTime() / 1000
    );
  }

  isHardeningInProgress() {
    return (
      new Date().getTime() / 1000 < this.casting_start + this.hardening_duration
    );
  }

  isHardeningFinished() {
    return (
      this.casting_start + this.hardening_duration < new Date().getTime() / 1000
    );
  }

  getCuringRemainingTime() {
    let curingEnding = this.casting_start + this.curing_duration;
    let remainingTime = curingEnding - new Date().getTime() / 1000;

    return remainingTime;
  }

  getHardeningRemainingTime() {
    let hardeningEnding = this.casting_start + this.hardening_duration;
    let remainingTime = hardeningEnding - new Date().getTime() / 1000;

    return remainingTime;
  }
}

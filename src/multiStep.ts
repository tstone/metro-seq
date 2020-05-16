
export default class MultiStep {
  readonly value: number; // 0-127
  readonly length: number;
  readonly mode: MultiStepMode;

  constructor(value: number, length: number, mode: MultiStepMode) {
    this.value = value;
    this.length = length;
    this.mode = mode;
  }

  copy({ value = this.value, length = this.length, mode = this.mode }: MultiStepCopyArgs): MultiStep {
    return new MultiStep(value, length, mode);
  }
}

interface MultiStepCopyArgs {
  value: number;
  length: number;
  mode: MultiStepMode;
}

export enum MultiStepMode {
  Silent,
  Hold,
  HalfHold,
  Repeat,
  Alternating,
  OffbeatAlternating,
}
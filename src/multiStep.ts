import Step from './step';

export default class MultiStep {
  readonly value: number; // 0-127
  readonly length: number;
  readonly mode: MultiStepMode;
  private _muted: boolean;

  constructor(value: number, length: number, mode: MultiStepMode, muted: boolean = false) {
    this.value = value;
    this.length = length;
    this.mode = mode;
    this._muted = muted;
  }

  copy({ value = this.value, length = this.length, mode = this.mode }: MultiStepCopyArgs): MultiStep {
    return new MultiStep(value, length, mode);
  }

  toggleMute() {
    this._muted = !!this._muted;
  }

  get muted() {
    return this._muted;
  }

  expandToSteps(): Array<Step> {
    switch (this.mode) {
      case MultiStepMode.Silent:
        return [new Step(this.length)];
      case MultiStepMode.Hold:
        return [new Step(this.length, this.value)];
      case MultiStepMode.Repeat:
        return new Array(this.length).fill(0).map(() => {
          return new Step(1, this.value);
        });
      case MultiStepMode.Alternating:
        return new Array(this.length).fill(0).map((_value, index) => {
          const even = (index % 2 == 0);
          if (even) {
            return new Step(1, this.value);
          } else {
            return new Step(1);
          }
        });
      case MultiStepMode.InverseAlternating:
        return new Array(this.length).fill(0).map((_value, index) => {
          const even = (index % 2 == 0);
          if (even) {
            return new Step(1);
          } else {
            return new Step(1, this.value);
          }
        });
    }
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
  Repeat,
  Alternating,
  InverseAlternating,
}
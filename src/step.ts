
export default class Step {
  readonly value: number;
  readonly length: number;

  static readonly minimumValue = 0;
  static readonly maximumValue = 127;

  constructor(value: number, length: number) {
    if (value < Step.minimumValue || value > Step.maximumValue) {
      throw new Error(`Step value must be between ${Step.minimumValue} and ${Step.maximumValue}. Was ${value}`);
    }

    this.value = value;
    this.length = length;
  }

  copy({ value = this.value, length = this.length }: StepCopyArgs): Step {
    return new Step(value, length);
  }
}

interface StepCopyArgs {
  value: number;
  length: number;
}

export default class Step {
  readonly value?: number;
  readonly length: number;

  // assuming everything is a quarter note for now
  // TODO: allow different beat divisions
  readonly lengthMultiplier: number = 1;

  static readonly minimumValue = 0;
  static readonly maximumValue = 127;

  constructor(length: number, value?: number, ) {
    if (value && value < Step.minimumValue || value && value > Step.maximumValue) {
      throw new Error(`Step value, if given, must be between ${Step.minimumValue} and ${Step.maximumValue}. Was ${value}`);
    }

    this.value = value;
    this.length = length;
  }

  copy({ value = this.value, length = this.length }: StepCopyArgs): Step {
    return new Step(length, value);
  }
}

interface StepCopyArgs {
  value?: number;
  length: number;
}
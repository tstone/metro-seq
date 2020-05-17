import { PitchedNote, Pitch } from "../note";
import Step from "../step";

export default class Quantizer {
  static quantize(octaveRange: number, value: number, rootOctave: number, orderedPossiblePitches: Array<Pitch>): PitchedNote {
    const octave = this.getOctaveFromValue(octaveRange, value);
    const pitchIndex = this.getPitchIndex(octaveRange, value, orderedPossiblePitches);
    return new PitchedNote(orderedPossiblePitches[pitchIndex], rootOctave + octave);
  }

  static incrementValue(octaveRange: number, originValue: number, orderedPossiblePitches: Array<Pitch>): number {
    const scaledValueMax = Step.maximumValue / octaveRange;
    const stepSize = scaledValueMax / orderedPossiblePitches.length;
    return originValue + stepSize;
  }

  static decrementValue(octaveRange: number, originValue: number, orderedPossiblePitches: Array<Pitch>): number {
    const scaledValueMax = Step.maximumValue / octaveRange;
    const stepSize = scaledValueMax / orderedPossiblePitches.length;
    return originValue - stepSize;
  }

  /**
   * Figure out which octave a value is in, within a given range.
   * 
   * e.g. for a value range of 0-127, and an octave range of 2,
   * the value 21 would be in octave 1, and 80 in octave 2.
   */
  private static getOctaveFromValue(octaveRange: number, value: number): number {
    let octave = Math.ceil((value / Step.maximumValue) * octaveRange);
    return Math.max(octave, 1) - 1;
  }

  /**
   * For a given value and octave range, returns the correspondingly scaled
   * index within the possible pitches.
   */
  private static getPitchIndex(octaveRange: number, value: number, orderedPossiblePitches: Array<Pitch>): number {
    const octave = this.getOctaveFromValue(octaveRange, value);
    const scaledValueMax = Step.maximumValue / octaveRange;
    const scalePercent = (value - (scaledValueMax * octave)) / scaledValueMax;

    let pitchIndex = Math.ceil(scalePercent * orderedPossiblePitches.length) - 1;
    return Math.max(0, pitchIndex);
  }
}
import Note, { Pitch } from "../note";
import Step from "../step";

export default class Quantizer {
  static quantize(octaveRange: number, value: number, rootOctave: number, orderedPossiblePitches: Array<Pitch>): Note {
    let octave = Math.ceil((value / Step.maximumValue) * octaveRange);
    octave = Math.max(octave, 1) - 1;

    const scaledValueMax = Step.maximumValue / octaveRange;
    const scalePercent = (value - (scaledValueMax * octave)) / scaledValueMax;

    let pitchIndex = Math.ceil(scalePercent * orderedPossiblePitches.length) - 1;
    pitchIndex = Math.max(0, pitchIndex);

    return new Note(orderedPossiblePitches[pitchIndex], rootOctave + octave);
  }
}
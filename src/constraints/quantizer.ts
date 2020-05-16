import Note, { Pitch } from "../note";
import Step from "../step";

export default class Quantizer {
  static quantize(octaveRange: number, value: number, rootOctave: number, orderedPossiblePitches: Array<Pitch>): Note {
    // octave range = 2
    // value = 31.75
    // root = C3
    // expected output = F3 (index 6, octave +0)

    let octave;
    if (value === 0) {
      octave = 0;
    } else {
      octave = Math.ceil((value / Step.maximumValue) * octaveRange) - 1;
    }

    const pitchIndex = Math.ceil(value / (Step.maximumValue / octaveRange) * orderedPossiblePitches.length);
    return new Note(orderedPossiblePitches[pitchIndex], rootOctave + octave);
  }
}
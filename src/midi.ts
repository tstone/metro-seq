import { PitchedNote } from ".";
import { ChromaticScale } from "./constants/scales";

export default class MIDI {
  static noteToMIDINoteNumber(note: PitchedNote): number {
    // Because C-1 = 0, offset the octave by -1
    const offsetOctave = note.octave + 1;
    const targetPitch = note.equivalentSharpPitch();
    const distanceFromC = ChromaticScale.findIndex(pitch => pitch === targetPitch);
    return (offsetOctave * 12) + distanceFromC;
  }
}
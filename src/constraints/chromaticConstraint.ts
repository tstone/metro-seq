import NoteConstraint from '../noteConstraint';
import { PitchedNote } from '../note';
import Quantizer from './quantizer';
import { ChromaticScale } from '../constants/scales';

export default class ChromaticConstraint implements NoteConstraint {
  readonly octaveRange: number;
  readonly rootOctave: number;
  readonly length: number;
  readonly discreteNoteCount: number = ChromaticScale.length;

  constructor(length: number, octaveRange: number, rootOctave: number = 3) {
    this.octaveRange = octaveRange;
    this.rootOctave = rootOctave;
    this.length = length;
  }

  quantizeValue(value: number): PitchedNote {
    return Quantizer.quantize(this.octaveRange, value, this.rootOctave, ChromaticScale);
  }

  nextValue(origin: number): number {
    return Quantizer.incrementValue(this.octaveRange, origin, ChromaticScale);
  }

  previousValue(origin: number): number {
    return Quantizer.decrementValue(this.octaveRange, origin, ChromaticScale);
  }

}
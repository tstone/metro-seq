import NoteConstraint from '../noteConstraint';
import Step from '../step';
import Note from '../note';
import Quantizer from './quantizer';

export default class ChromaticConstraint implements NoteConstraint {
  readonly octaveRange: number;
  readonly rootOctave: number;

  constructor(octaveRange: number, rootOctave: number = 3) {
    this.octaveRange = octaveRange;
    this.rootOctave = rootOctave;
  }

  isAllowed(_note: Note): boolean {
    return true;
  }

  quantizeStep(step: Step): Note {
    return Quantizer.quantize(this.octaveRange, step.value, this.rootOctave, Note.chromaticScale);
  }

}
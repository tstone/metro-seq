import NoteConstraint from './noteConstraint';
import MultiStep from './multiStep';
import Step from './step';

export default class Sequence {
  readonly bpm: number;
  readonly length: number;
  readonly constraints: Array<NoteConstraint>;
  readonly steps: Array<MultiStep | Step>;

  constructor(bpm: number, length: number, constraints: Array<NoteConstraint>, steps: Array<MultiStep>) {
    this.bpm = bpm;
    this.length = length;
    this.constraints = constraints;
    this.steps = steps;
  }
}
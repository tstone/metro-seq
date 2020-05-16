import NoteConstraint from './noteConstraint';
import MultiStep from './multiStep';
import Step from './step';

export default class Phrase {
  readonly length: number;
  readonly constraint: NoteConstraint;
  readonly steps: Array<MultiStep | Step>;

  constructor(length: number, constraint: NoteConstraint, steps: Array<MultiStep | Step>) {
    this.length = length;
    this.constraint = constraint;
    this.steps = steps;
  }
}
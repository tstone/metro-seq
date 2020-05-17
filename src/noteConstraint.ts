import { PitchedNote } from './note';

export default interface NoteConstraint {
  readonly length: number;
  readonly octaveRange: number;

  /**
   * How many possible notes are in this constraint
   */
  readonly discreteNoteCount: number;

  quantizeValue(value: number): PitchedNote

  /**
   * Given a starting value (origin), determine the next value
   * based on the amount of possible notes in this constraint.
   */
  nextValue(origin: number): number;

  /**
   * Same as `nextValue`, but decrementing instead.
   */
  previousValue(origin: number): number;
}
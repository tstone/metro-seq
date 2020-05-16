import Note from './note';
import Step from './step';

export default interface NoteConstraint {
  isAllowed(note: Note): boolean;
  quantizeStep(step: Step): Note
}
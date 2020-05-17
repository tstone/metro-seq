import NoteConstraint from './noteConstraint';
import MultiStep from './multiStep';
import Step from './step';
import BPM, { Timing } from './BPM';
import { EventEmitter } from 'events';
import { Note } from '.';

export default class Sequence extends EventEmitter {
  private tickState: TickState;
  private timer?: NodeJS.Timer;

  constructor(
    readonly timing: Timing,
    readonly constraints: Array<NoteConstraint>,
    readonly steps: Array<MultiStep>
  ) {
    super();
    this.timing = timing;
    this.constraints = constraints;
    this.steps = steps;
    this.tickState = this.getStartingTickState();
  }

  start() {
    if (!this.timer) {
      const tickDuration = BPM.getTickDuration(this.timing);
      this.emit('start');
      this.timer = setInterval(() => {
        this.tickState = this.tick(this.getTickState());
      }, tickDuration);
    }
  }

  pause() {
    if (this.timer) {
      this.emit('pause');
      clearInterval(this.timer);
    }
  }

  stop() {
    if (this.timer) {
      this.emit('stop');
      clearInterval(this.timer);
      this.tickState = this.getStartingTickState();
    }
  }

  private getTickState() {
    return this.tickState;
  }

  private getStartingTickState(): TickState {
    return new TickState(
      this.timing.bpm,
      this.constraints,
      this.steps,
      0, // multiStepCursor
      0, // stepCursor
      0, // constraintCursor
      false // gateOffSent
    );
  }

  private tick(tickState: TickState): TickState {
    // Implementation Note -- tick loop VS TickState
    // -------------------
    // tick loop (this code): about what to DO when significant ticks happen
    // TickState: about what the current state is

    const now = new Date().getTime();

    // Gate vs Step time
    // -------------------
    // A step with a lengthMultiplier of 1 and a gateLength of 0.5 will take 
    // up a quarter note's time before the next step is advanced to, but the
    // gate will close (note off) after an eighth note's time.

    let gateOffSent = false;
    if (tickState.remainingGateTimeOnCurrentStep(now) <= 0 && !tickState.gateOffSent) {
      gateOffSent = true;
      // the previous step has completed; process the next step
      if (tickState.currentNote) {
        // TODO: this is more or less assuming a gate length of 100%
        // add in a feature to set a global gate length or evne better, a per-step gate length
        // total time and remaining time for the step will need to reflect the gate length
        // it basically means notoff will fire indepdently of the remaining time on current step
        this.emit('noteoff', { note: tickState.currentNote.toString() });
      }
    }

    if (tickState.isFirstRun || tickState.remainingStepTimeOnCurrentStep(now) <= 0) {
      const advanceBy = tickState.isFirstRun ? 0 : 1;
      const updatedTickState = tickState.advanceStep(advanceBy, now);
      if (updatedTickState.currentNote) {
        this.emit('noteon', { note: updatedTickState.currentNote.toString() });
      }
      return updatedTickState;
    } else if (!tickState.stepStartTime) {
      return tickState.tick({ stepStartTime: now });
    } else if (gateOffSent) {
      return tickState.tick({ gateOffSent });
    } else {
      return tickState.tick();
    }
  }
}

class TickState {
  constructor(
    readonly bpm: number,
    readonly constraints: Array<NoteConstraint>,
    readonly multiSteps: Array<MultiStep>,
    readonly multiStepCursor: number,
    readonly stepCursor: number,
    readonly constraintCursor: number = 1, // leaving it at the first for now
    readonly gateOffSent: boolean,
    readonly isFirstRun: boolean = true,
    readonly stepStartTime?: number,
    currentExpandedSteps?: Array<Step>,
    currentNote?: Note, // this needs to be saved to send the corrent NoteOff message
  ) {
    this._currentExpandedSteps = currentExpandedSteps;
    this._currentNote = currentNote;
  }

  private _currentExpandedSteps?: Array<Step>
  private _currentNote?: Note;

  get currentExpandedSteps(): Array<Step> {
    if (!this._currentExpandedSteps) {
      this._currentExpandedSteps = this.multiSteps[this.multiStepCursor].expandToSteps();
      this.resetCurrentStep();
    }
    return this._currentExpandedSteps;
  }

  get currentConstraint(): NoteConstraint {
    return this.constraints[this.constraintCursor];
  }

  get currentStep(): Step {
    return this.currentExpandedSteps[this.stepCursor];
  }

  get currentNote(): Note | undefined {
    if (!this._currentNote && this.currentStep && this.currentStep.value !== undefined) {
      this._currentNote = this.currentConstraint.quantizeValue(this.currentStep.value);
    }
    return this._currentNote;
  }

  private resetCurrentMultiStep() {
    this._currentExpandedSteps = undefined;
    this.resetCurrentStep();
  }

  private resetCurrentStep() {
    this._currentNote = undefined;
  }

  get totalTimeForCurrentStep() {
    const currentStep = this.currentStep;
    return (currentStep.length * currentStep.lengthMultiplier) * BPM.toMillis(this.bpm);
  }

  get gateTimeForCurrentStep() {
    return this.totalTimeForCurrentStep * this.currentStep.gateLength;
  }

  /**
   * Returns the amount of time in millis that has elapsed for the current step
   * @param relativeToTime e.g. now
   */
  elaspedTimeOnCurrentStep(relativeToTime: number): number {
    if (this.stepStartTime) {
      return relativeToTime - this.stepStartTime;
    }
    return 0;
  }

  /**
   * Returns the amount of time in millis that remains before the current step is done
   * @param relativeToTime e.g. now
   */
  remainingStepTimeOnCurrentStep(relativeToTime: number) {
    return this.totalTimeForCurrentStep - this.elaspedTimeOnCurrentStep(relativeToTime);
  }

  /**
   * Returns the amount of time in millis that remains before the current step's GATE is done
   * @param relativeToTime e.g. now
   */
  remainingGateTimeOnCurrentStep(relativeToTime: number) {
    return this.gateTimeForCurrentStep - this.elaspedTimeOnCurrentStep(relativeToTime);
  }

  tick({ stepStartTime = this.stepStartTime, gateOffSent = this.gateOffSent }: { stepStartTime?: number, gateOffSent?: boolean } = {}): TickState {
    return new TickState(
      this.bpm,
      this.constraints,
      this.multiSteps,
      this.multiStepCursor,
      this.stepCursor,
      this.constraintCursor,
      gateOffSent,
      false, // isFirstRun
      stepStartTime,
      this.currentExpandedSteps,
      this.currentNote
    );
  }

  advanceStep(advanceBy: number, stepStartTime: number): TickState {
    let multiStepCursor = this.multiStepCursor;
    let stepCursor = this.stepCursor + advanceBy;

    if (stepCursor > (this.currentExpandedSteps.length - 1)) {
      stepCursor = 0;
      multiStepCursor += 1;
      this.resetCurrentMultiStep();
    }

    if (multiStepCursor > (this.multiSteps.length - 1)) {
      multiStepCursor = 0;
    }

    return new TickState(
      this.bpm,
      this.constraints,
      this.multiSteps,
      multiStepCursor,
      stepCursor,
      this.constraintCursor,
      false, // gateOffSent
      false, // isFirstRun
      stepStartTime,
      this._currentExpandedSteps,
      this._currentNote,
    );
  }

}

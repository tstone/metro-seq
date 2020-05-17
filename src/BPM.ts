
export default class BPM {
  static toSeconds(bpm: number): number {
    return bpm / 60;
  }

  static toMillis(bpm: number): number {
    return this.toSeconds(bpm) / 1000;
  }

  static getTickDuration(timing: Timing): number {
    return this.toMillis(timing.bpm) / timing.ppqn;
  }
}

export interface Timing {
  /** Pulses Per Quarter Note (e.g. resolution) */
  ppqn: number;
  /** Quarter Notes per Minute  (e.g. speed) */
  bpm: number;
}
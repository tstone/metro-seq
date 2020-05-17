export enum Pitch {
  A = "A",
  Ab = "Ab",
  ASharp = "A#",
  B = "B",
  Bb = "Bb",
  C = "C",
  CSharp = "C#",
  D = "D",
  Db = "Dd",
  DSharp = "D#",
  E = "E",
  Eb = "Eb",
  F = "F",
  FSharp = "F#",
  G = "G",
  Gb = "G",
  GSharp = "G#",
}

// --- Note ---

export default interface Note {
  isEqual(other: Note): boolean;
  isEqualPitch(other: Note): boolean;
}

// --- Rest ---

export class RestImpl implements Note {
  isEqual(other: Note): boolean {
    return (other instanceof RestImpl);
  }
  isEqualPitch(_other: Note): boolean {
    return false;
  }
}
export const Rest = new RestImpl();

// --- PitchedNote ---

export class PitchedNote {
  readonly pitch: Pitch;
  readonly octave: number;

  constructor(pitch: Pitch, octave: number) {
    this.pitch = pitch;
    this.octave = octave;
  }

  /**
   * Return either the natural or sharp of the current pitch
   * irregardless of if it's represented as a flat or sharp
   * TODO: extract this pitch management code to a separate PitchTools class
   */
  equivalentSharpPitch(): Pitch {
    switch (this.pitch) {
      case Pitch.Ab:
        return Pitch.GSharp;
      case Pitch.Bb:
        return Pitch.ASharp;
      case Pitch.Db:
        return Pitch.CSharp;
      case Pitch.Eb:
        return Pitch.DSharp;
      case Pitch.Gb:
        return Pitch.FSharp;
      default:
        return this.pitch;
    }
  }

  toString(): string {
    return `${this.pitch}${this.octave}`;
  }

  isEqualPitch(other: Note): boolean {
    if (other instanceof PitchedNote) {
      switch (this.pitch) {
        case Pitch.Ab:
          return other.pitch === Pitch.GSharp;
        case Pitch.ASharp:
          return other.pitch === Pitch.Bb;
        case Pitch.Bb:
          return other.pitch === Pitch.ASharp;
        case Pitch.CSharp:
          return other.pitch === Pitch.Db;
        case Pitch.Db:
          return other.pitch === Pitch.CSharp;
        case Pitch.DSharp:
          return other.pitch === Pitch.Eb;
        case Pitch.Eb:
          return other.pitch === Pitch.DSharp;
        case Pitch.FSharp:
          return other.pitch === Pitch.Gb;
        case Pitch.Gb:
          return other.pitch === Pitch.FSharp;
        case Pitch.GSharp:
          return other.pitch === Pitch.Ab;
        default:
          return other.pitch === this.pitch;
      }
    }
    return false;
  }

  isEqual(other: Note): boolean {
    if (other instanceof PitchedNote) {
      return this.octave === other.octave && this.isEqualPitch(other);
    }
    return false;
  }
}
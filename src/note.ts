
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

export default class Note {
  readonly pitch: Pitch;
  readonly octave: Number;

  constructor(pitch: Pitch, octave: Number) {
    this.pitch = pitch;
    this.octave = octave;
  }

  toString(): string {
    return `${this.pitch}${this.octave}`;
  }

  isEqualPitch(other: Note): boolean {
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

  isEqual(other: Note): boolean {
    return this.octave === other.octave && this.isEqualPitch(other);
  }

  static readonly chromaticScale: Array<Pitch> = [
    Pitch.C,
    Pitch.CSharp,
    Pitch.D,
    Pitch.DSharp,
    Pitch.E,
    Pitch.F,
    Pitch.FSharp,
    Pitch.G,
    Pitch.GSharp,
    Pitch.A,
    Pitch.ASharp,
    Pitch.B
  ];
}
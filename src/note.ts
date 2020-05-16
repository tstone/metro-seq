
export enum Pitch {
  A,
  Ab,
  ASharp,
  B,
  Bb,
  C,
  CSharp,
  D,
  Db,
  DSharp,
  E,
  Eb,
  F,
  FSharp,
  G,
  Gb,
  GSharp,
}

export default class Note {
  readonly pitch: Pitch;
  readonly octave: Number;

  constructor(pitch: Pitch, octave: Number) {
    this.pitch = pitch;
    this.octave = octave;
  }

  public toString = (): string => {
    return `${this.pitch}${this.octave}`;
  }

  isEqual(other: Note): boolean {
    return this.octave === other.octave && this.isEqualPitch(other);
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
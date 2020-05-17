const test = require('ava');
const MIDI = require('../build/midi').default;
const { PitchedNote, Pitch } = require('../build');

// noteToMIDINoteNumber

const noteToMIDINoteNumber = (t, note, number) => {
  const midiNum = MIDI.noteToMIDINoteNumber(note);
  t.is(midiNum, number);
}

test('A0 is 21', noteToMIDINoteNumber, new PitchedNote(Pitch.A, 0), 21);
test('A#0 is 21', noteToMIDINoteNumber, new PitchedNote(Pitch.ASharp, 0), 22);
test('Eb3 is 51', noteToMIDINoteNumber, new PitchedNote(Pitch.Eb, 3), 51);
test('C4 is 60', noteToMIDINoteNumber, new PitchedNote(Pitch.C, 4), 60);
test('Gb6 is 90', noteToMIDINoteNumber, new PitchedNote(Pitch.Gb, 6), 90);

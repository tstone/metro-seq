const test = require('ava');
const { PitchedNote, Pitch } = require('../build');

// isEqualPitch

const isEqualPitch = (t, pitch1, pitch2) => {
  const note1 = new PitchedNote(pitch1, 1);
  const note2 = new PitchedNote(pitch2, 1);
  t.is(note1.isEqualPitch(note2), true);
}

test('Ab equals G#', isEqualPitch, Pitch.Ab, Pitch.GSharp);
test('Gb equals F#', isEqualPitch, Pitch.Gb, Pitch.FSharp);
test('B equals B', isEqualPitch, Pitch.B, Pitch.B);

// isEqual

test('E4 equals E4', t => {
  const note = new PitchedNote(Pitch.E, 4);
  t.is(note.isEqual(note), true);
});

test('E4 does not equal E5', t => {
  const note1 = new PitchedNote(Pitch.E, 4);
  const note2 = new PitchedNote(Pitch.E, 5);
  t.is(note1.isEqual(note2), false);
});

// toNoteString

test('toString', t => {
  const note = new PitchedNote(Pitch.ASharp, 3);
  t.is(note.toString(), 'A#3');
});
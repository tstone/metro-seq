const test = require('ava');
const Quantizer = require('../../build/constraints/quantizer').default;
const { PitchedNote, Pitch } = require('../../build');
const { ChromaticScale } = require('../../build/constants/scales');

// quantize

const quantizeOneOctave = (t, value, expectedPitch) => {
  const result = Quantizer.quantize(1, value, 1, ChromaticScale);
  t.is(result.pitch, expectedPitch);
  t.is(result.octave, 1);
}

test('one octave: left edge', quantizeOneOctave, 0, Pitch.C);
test('one octave: middle', quantizeOneOctave, 63.5, Pitch.F);
test('one octave: right edge', quantizeOneOctave, 127, Pitch.B);

const quantizeMultiOctave = (t, octaveRange, value, expectedNote) => {
  const result = Quantizer.quantize(octaveRange, value, 1, ChromaticScale);
  t.is(result.pitch, expectedNote.pitch);
  t.is(result.octave, expectedNote.octave);
}

test('two octave: first octave, left edge', quantizeMultiOctave, 2, 0, new PitchedNote(Pitch.C, 1));
test('two octave: first octave, middle', quantizeMultiOctave, 2, 31.75, new PitchedNote(Pitch.F, 1));
test('two octave: first octave, right edge', quantizeMultiOctave, 2, 63.5, new PitchedNote(Pitch.B, 1));
test('two octave: second octave, left edge', quantizeMultiOctave, 2, 63.6, new PitchedNote(Pitch.C, 2));
test('two octave: second octave, middle', quantizeMultiOctave, 2, 92.25, new PitchedNote(Pitch.F, 2));
test('two octave: second octave, right edge', quantizeMultiOctave, 2, 127, new PitchedNote(Pitch.B, 2));

test('three octave: first octave, left edge', quantizeMultiOctave, 3, 0, new PitchedNote(Pitch.C, 1));
test('three octave: first octave, middle', quantizeMultiOctave, 3, 21.16, new PitchedNote(Pitch.F, 1));
test('three octave: first octave, right edge', quantizeMultiOctave, 3, 42.33, new PitchedNote(Pitch.B, 1));
test('three octave: second octave, left edge', quantizeMultiOctave, 3, 42.4, new PitchedNote(Pitch.C, 2));
test('three octave: second octave, middle', quantizeMultiOctave, 3, 63.5, new PitchedNote(Pitch.F, 2));
test('three octave: second octave, right edge', quantizeMultiOctave, 3, 84.66, new PitchedNote(Pitch.B, 2));
test('three octave: third octave, left edge', quantizeMultiOctave, 3, 85, new PitchedNote(Pitch.C, 3));
test('three octave: third octave, middle', quantizeMultiOctave, 3, 105.8, new PitchedNote(Pitch.F, 3));
test('three octave: third octave, right edge', quantizeMultiOctave, 3, 127, new PitchedNote(Pitch.B, 3));

// incrementValue

const simpleSet = [Pitch.A, Pitch.B, Pitch.C, Pitch.D];

test('one octave: incrementValue returns the next value', t => {
  // step size = 31.75
  const result = Quantizer.incrementValue(1, 10, simpleSet);
  const note = Quantizer.quantize(1, result, 1, simpleSet);
  t.is(note.pitch, Pitch.B);
  t.is(note.octave, 1);
});

test('two octaves: incrementValue returns the next value', t => {
  // step size = 15.875
  const result = Quantizer.incrementValue(2, 16, simpleSet);
  const note = Quantizer.quantize(2, result, 1, simpleSet);
  t.is(note.pitch, Pitch.C);
  t.is(note.octave, 1);
});

test('three octaves: incrementValue returns the next value', t => {
  // step size = 10.583
  const result = Quantizer.incrementValue(3, 43, simpleSet);
  const note = Quantizer.quantize(3, result, 1, simpleSet);
  t.is(note.pitch, Pitch.B);
  t.is(note.octave, 2);
});
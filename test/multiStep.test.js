const test = require('ava');
const { MultiStep, MultiStepMode } = require('../build');

// expandToSteps

test('expandToSteps: Silent', t => {
  const mstep = new MultiStep(100, 5, MultiStepMode.Silent);
  const steps = mstep.expandToSteps();

  t.is(steps.length, 1);
  t.is(steps[0].length, 5);
  t.falsy(steps[0].value);
});

test('expandToSteps: Hold', t => {
  const mstep = new MultiStep(100, 5, MultiStepMode.Hold);
  const steps = mstep.expandToSteps();

  t.is(steps.length, 1);
  t.is(steps[0].length, 5);
  t.is(steps[0].value, 100);
});

test('expandToSteps: Repeat', t => {
  const mstep = new MultiStep(100, 5, MultiStepMode.Repeat);
  const steps = mstep.expandToSteps();

  t.is(steps.length, 5);
  t.is(steps[0].length, 1);
  t.is(steps[0].value, 100);
  t.is(steps[2].length, 1);
  t.is(steps[2].value, 100);
  t.is(steps[4].length, 1);
  t.is(steps[4].value, 100);
});

test('expandToSteps: Alternating', t => {
  const mstep = new MultiStep(100, 5, MultiStepMode.Alternating);
  const steps = mstep.expandToSteps();

  t.is(steps.length, 5);
  t.is(steps[0].length, 1);
  t.is(steps[0].value, 100);
  t.is(steps[1].length, 1);
  t.falsy(steps[1].value);
  t.is(steps[2].length, 1);
  t.is(steps[2].value, 100);
  t.is(steps[3].length, 1);
  t.falsy(steps[3].value);
  t.is(steps[4].length, 1);
  t.is(steps[4].value, 100);
});

test('expandToSteps: InverseAlternating', t => {
  const mstep = new MultiStep(100, 3, MultiStepMode.InverseAlternating);
  const steps = mstep.expandToSteps();

  t.is(steps.length, 3);
  t.is(steps[0].length, 1);
  t.falsy(steps[0].value);
  t.is(steps[1].length, 1);
  t.is(steps[1].value, 100);
  t.is(steps[2].length, 1);
  t.falsy(steps[2].value);
});
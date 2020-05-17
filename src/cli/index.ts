import { Sequence, ChromaticConstraint, MultiStep, MultiStepMode } from '../';

const sequence = new Sequence(
  { bpm: 60, ppqn: 6 },
  [new ChromaticConstraint(1, 2)],
  [
    new MultiStep(0, 3, MultiStepMode.Repeat),
    new MultiStep(65, 3, MultiStepMode.Repeat),
    new MultiStep(127, 3, MultiStepMode.Repeat),
  ]
)

sequence.on('start', event => {
  console.log('START', JSON.stringify(event));
});

sequence.on('stop', event => {
  console.log('STOP', JSON.stringify(event));
});

sequence.on('noteon', event => {
  console.log('NOTEON', JSON.stringify(event));
});

sequence.on('noteoff', event => {
  console.log('NOTEOFF', JSON.stringify(event));
});

sequence.start();

setTimeout(() => {
  sequence.stop();
}, 10000);
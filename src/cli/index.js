const easymidi = require('easymidi');
const readline = require('readline');
const { Sequence, ChromaticConstraint, MultiStep, MultiStepMode, MIDI } = require('../../build');

// -------------------
// Edit this to change the sequence:

function getSequence(bpm) {
  new Sequence(
    { bpm, ppqn: 96 },
    [new ChromaticConstraint(1, 2)],
    [
      new MultiStep(0, 3, MultiStepMode.Repeat),
      new MultiStep(65, 3, MultiStepMode.Repeat),
      new MultiStep(127, 3, MultiStepMode.Repeat),
    ]
  );
}

// -------------------

class App {
  async start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const device = await this.pickDevice(rl);
    const output = new easymidi.Output(device, false);
    const channel = await this.getNumber('Enter the destination MIDI channel: ', rl);
    const bpm = await this.getNumber('Enter BPM: ', rl);

    rl.close();

    process.on('beforExit', () => output.close());
    process.on('exit', () => output.close());
    process.on('disconnect', () => output.close());
    // TODO: need to send a ALL NOTE OFF on shutdown as well

    const offestChannel = channel - 1; // easymidi seems to be 0 indexed
    console.log(`Starting sequencer. Sending to ${device} on channel ${channel}`);
    this.runSequencer(output, offestChannel, bpm);
  }

  getNumber(question, rl) {
    return new Promise((resolve, reject) => {
      rl.question(question, (answer) => {
        try {
          resolve(parseInt(answer));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  pickDevice(rl) {
    const outputDevices = easymidi.getOutputs();
    const message = outputDevices.reduce((acc, deviceName, index) => {
      return acc + `${index}: ${deviceName}\n`;
    }, '') + '\nSelect an output device: ';

    return new Promise((resolve, reject) => {
      rl.question(message, (answer) => {
        try {
          const deviceIndex = parseInt(answer);
          resolve(outputDevices[deviceIndex]);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  runSequencer(midiOut, channel, bpm) {
    const sequence = getSequence(bpm);

    sequence.on('start', event => {
      console.log('START', JSON.stringify(event));
      midiOut.send('start', { channel });
    });

    sequence.on('stop', event => {
      console.log('STOP', JSON.stringify(event));
      midiOut.send('stop', { channel });
    });

    sequence.on('noteon', event => {
      console.log('open?', midiOut.isPortOpen());
      console.log('NOTEON', JSON.stringify(event));
      midiOut.send('noteon', {
        note: event.midiNoteNumber + 12, // easymidi sends the wrong pitch
        velocity: 127,
        channel
      });
    });

    sequence.on('noteoff', event => {
      console.log('NOTEOFF', JSON.stringify(event));
      midiOut.send('noteoff', {
        note: event.midiNoteNumber + 12,
        velocity: 127,
        channel
      });
    });

    sequence.start();
  }
}

const app = new App();
app.start();
process.stdin.resume();
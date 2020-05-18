# Metro Seq (Library & CLI Tool)

### _Under Development_

### Setup

```
$ git clone git@github.com:tstone/metro-seq.git
$ cd metro-seq
$ npm install
```

### Operation
```
$ npm start
```

### Editing to Sequence

(under development)

Edit `getSequence` at the top of `./src/cli/index.js`

#### TODO

 * [ ] Changing the length multiplier does not seem to work
 * [ ] Write tests for TickState to make sure it's working correctly
 * [ ] Need to define a way to modify the length multiplier for MultiStep
 * [ ] Make a better UI (below)

#### NOTES / CLI ideas (mostly to myself):

QWERTY to control steps
max 24 step, Q-P, A-L, Z-B
hold key + ...
+ up/down arrow = increment/decrement note
+ left/right = swap step left or right
+ [/] = change mode
+ number = jump to position (# = %, e.g. 9 = 90%)
+ enter = mute

other...
shift + arrow up/down = bpm
shift + arrow left/right = increase/decrease step count
space = play pause

startup...
select midi device
enter channel
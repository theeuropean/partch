# UNDER CONSTRUCTION

# Partch

A minimal but expressive wrapper around the Web Audio API. Think of it as jQuery for the WAA.

(Please note: all example code is in ES6. The Partch project recommends Babel for your ES6 transpilation needs).

## Example

```
// Get a Planner object
const p = partch(new window.AudioContext())

// Plan a simple synth
const simpleSynth = p(
  p.osc({ type: 'sawtooth', track: 1 }),
  p.biquad('filter', { track: 0.5 }),
  p.gain('amp'),
  p.gain('vol')
).concat(
  'filterEnv'
  p.adsr(),
  p.gain('level'),
  p.gain(100),
  p.to('filter.detune')
).concat(
  'ampEnv'
  p.adsr(),
  p.to('amp.gain')
)

// Plan an echo effect
const echo = p(
  p.delay(250)
).concat(
  p.from('delay'),
  p.gain('feedback'),
  p.to('delay')
)

// Compose another simple synth plan from those plans
const sqrEchoSynth = p(
  simpleSynth({
    osc: { type: 'pulse' },
    filterEnv: { adsr: { a: 0.1, d: 0.1, s: 0.5, r: 1 } },
    vol: 0.5
  }),
  echo({ delay: 500 })
)

// Render sqrEchoSynth to a graph of WAA nodes,
// play MIDI note 32 at velocity 100 for 1 second,
// then teardown the graph
sqrEchoSynth.note(32, 100, 1)
```

## Installation

## Setup

## Overview

Partch works by giving you a simple API with which you can build "plans". You can think of plans as virtual representations of graphs of Web Audio API nodes, a bit like the "shadow DOM" used by frameworks such as React.

The WAA is heavily optimised for high-performance creation and destruction of audio nodes, and these objects are intended to be disposed of after use. So it makes sense to focus our efforts on the factories which create these objects rather than the objects themselves.

The first step is to get a Planner function by passing a Web Audio API AudioContext object to the `partch` method. You can do this as follows:

```
const p = partch(new window.AudioContext())
```

This function `p` is your gateway to all the functionality of Partch, allowing you to create virtual nodes, wire them together into a plan, and finally render them into a real graph of WAA nodes. Here's an example of making a plan for an ultra-simple synth using a Planner function, and then playing a note with it:

```
const drone = p(
  p.osc()
)

const voice = drone.start(0)
voice.stop(1)
```

This will play a 440Hz sinewave for 1 second which is not very sonically interesting, but actually a lot of interesting stuff is happening here. Firstly, we are creating a plan for one oscillator with all the default settings (440Hz frequency, sine waveform). Then we are rendering that plan to a graph of WAA nodes, starting all the audio sources in that graph 0 seconds from now (i.e. immediately) and returning the graph itself. Then we are telling the returned graph to stop all its audio sources 1 second from now, and then destroy all its nodes.

A more terse way to tell the plan to do all that is with the `play` method, like so:

```
drone.play(0, 1)
```

This accomplishes exactly the same thing as the code above, note however that the second argument instructs it to play for one second from the time it starts, *not* one second from now.

Anyway this is great if you just want to play 440Hz sine waves, but what if you want a different pitch every time you play the plan, and also you want to use a sawtooth waveform? Easy:

```
drone.note(0, 1, 44, 127, { osc: { track: 1, type: 'sawtooth' } })
```

This command does three things. First it "forks" the original plan, making a copy of it with the changes specified in your options object (the last argument). Secondly it renders that plan with 

## API reference

### partch(audioContext)

Returns a new Planner for the given AudioContext.

### The Planner

The Planner is a factory function with methods attached. These methods return vnodes and connections which can in turn be used as arguments to the function.

### Planner methods

#### vnodes

All the vnode factory methods take up to one string, up to one number and any number of objects. Objects are merged together into one object, with later objects overriding attributes of earlier objects. The string is used as the vnode's unique id in that plan, the number is used as the value of the default parameter for that vnode type, and the options are used to configure the vnodes parameters.

##### gain

```
p.gain('vol', 0.5)
```

AudioParams:
  gain: float

##### osc

```
p.osc('sqrosc', 440, { type: 'pulse' })
```

Params:
  type: string: one of 'sine', 'square'
AudioParams:
  frequency: float
  detune: float
Default parameter: frequency.value

### Planner function

The function itself takes an optional plan type (the first string in the arguments list will be used) and any number of virtual nodes and connections, which form a plan.

The plan type is the default id used when forking this plan inside another plan.

The vnodes are connected up in succession, either via their default inputs and outputs, or via specified vconns (virtual connections).
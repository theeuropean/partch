let tripleSynth = p(

  p.in,
  p.poly('sources', { channels: 3 },
    p.osc(),
    p.gain()
  ),
  '>.detune',
  p.biquad('filter', { detune: '~filterLFO' }),
  p.gain('vol'),
  p.out,

  p.osc('lfo', { frequency: 2 }),
  [
    p.gain('filterLFO'),
    p.gain('volLFO')
  ]
)

let thickBass = tripleSynth.preset({
  sources: { osc: { waveform: 'pulse' }, gain: 0.3 },
  sources_0: { osc: { detune: -0.1 } },
  sources_2: { osc: { detune:  0.1 } },
  filter: { cutoff: { value: 0.2 } }
})

let instance = thickBass.render({ pitch: 440 }).play(0.0001, 1)

let instance = thickBass.play({ pitch: 440 }, 0.0001, 1)

instance.mod()

/* TODO

0.1

in, out
conn - can take node name or actual WAA node
inline audio param modulation
- taking a vnode
- taking a ~name
nodes map
docs
tests
listening tests (arpeggio)
install
  namespaces

core modules:
  env (kr or ar option)
  adsr
  dc (outputs constant value)

think about render/graph functions
  noteOn(nn, vel, options) method
  noteOff(nn, vel, options) method
  note(nn, vel, dur, options) method
  track param for oscs, filters etc

Later

Graph.midiIn(MIDIMessageEvent) method
Graph.auto method
Plan.auto method
assign (maps controllers to params)
rest of native nodes
params
param translations
core modules:
  poly (abstraction over parallel circuits)
arrays for parallel circuits
exception for duplicate id
exception for invalid id (reserved words or chars)

*/
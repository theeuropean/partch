const buggedAudioContext = require('./bugged_audio_context')
const partch = require('../src/partch')

describe('partch', () => {

  let ac
  let p

  beforeEach(() => {
    ac = buggedAudioContext()
    p = partch(ac)
  })

  it('can render a gain node', () => {
    p(p.gain()).render()
    ac.nodes[0].should.be.instanceOf(GainNode)
  })

})
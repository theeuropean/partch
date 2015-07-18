const partch = require('./src/partch')

describe('partch', () => {

  let audioContext
  let p

  beforeEach(() => {
    audioContext = new window.AudioContext()
    p = partch(audioContext)
  })

  it('plays an osc', (done) => {
    let ping = p(
      'ping',
      p.osc(500, { type: 'sawtooth' }),
      p.gain('vol', 0.1)
    )

    let lowPing = p(
      ping('pinger', { osc: 250, vol: 0.1 }),
      p.biquad(200)
    )

    let vLowPing = lowPing({ pinger: { osc: 125 } })

    // ping.render({ connect: p.acdest }).play(0.5)
    // lowPing.render({ connect: p.acdest }).play(0.5)
    vLowPing.render({ connect: p.acdest }).play(0.5)
    
    setTimeout(done, 1000)
  })

})
const sinon = require("sinon")

function buggedAudioContext() {

  const ac = new window.AudioContext()
  ac.nodes = []
  
  wrapNativeNodeFn('Gain')
  wrapNativeNodeFn('Delay')
  wrapNativeNodeFn('BiquadFilter')
  wrapNativeNodeFn('Oscillator')

  function wrapNativeNodeFn(name) {
    const createFnName = `create${ name }`
    const createFn = ac[createFnName]

    sinon.stub(ac, createFnName, (...args) => {
      var newNode = createFn.apply(ac, args)
      if(newNode.connect) sinon.spy(newNode, 'connect')
      if(newNode.start) sinon.spy(newNode, 'start')
      if(newNode.stop) sinon.spy(newNode, 'stop')
      ac.nodes.push(newNode)
      return newNode
    })
  }

  return ac
}

module.exports = buggedAudioContext
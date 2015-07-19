const sinon = require("sinon")

function buggedAudioContext() {
  const ac = new window.AudioContext()
  const sandbox = sinon.sandbox.create()
  ac.init = init
  
  function init() {
    ac.nodes = []
    sandbox.restore()

    wrapNativeNodeFn('Gain')
    wrapNativeNodeFn('Delay')
    wrapNativeNodeFn('BiquadFilter')
    wrapNativeNodeFn('Oscillator')

    function wrapNativeNodeFn(name) {
      const createFnName = `create${ name }`
      const createFn = ac[createFnName]

      sandbox.stub(ac, createFnName, (...args) => {
        var newNode = createFn.apply(ac, args)
        if(newNode.connect) sandbox.spy(newNode, 'connect')
        if(newNode.start) sandbox.spy(newNode, 'start')
        if(newNode.stop) sandbox.spy(newNode, 'stop')
        ac.nodes.push(newNode)
        return newNode
      })
    }    
  }

  return ac
}

module.exports = buggedAudioContext
const _ = require('lodash')
const helpers = require('./helpers')
const renderers = require('./renderers')

const CONFIGS = {
  gain: { 
    acFactory: 'createGain',
    defaultParam: 'gain.value'
  },
  delay: {
    acFactory: 'createDelay',
    defaultParam: 'delayTime.value',
    creationArgs: ['maxDelayTime']
  },
  osc: {
    acFactory: 'createOscillator',
    defaultParam: 'frequency.value'
  },
  biquad: {
    acFactory: 'createBiquadFilter',
    defaultParam: 'frequency.value'
  }
}

_.forIn(CONFIGS, (config, name) => {
  function render(planner, value, options) {
    let creationArgs = []
    if(value && config.defaultParam) {
      _.set(options, config.defaultParam, value)
    }
    if(config.creationArgs) {
      creationArgs = _.values(
        _.pick(options, config.creationArgs)
      )      
    }
    const node = planner.audioContext[config.acFactory](...creationArgs)
    helpers.configureNode(node, options)
    node.input = node
    return node    
  }

  renderers.install({ name, render })
})
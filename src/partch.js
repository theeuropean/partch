const _ = require('lodash')
const plan = require('./plan')
const helpers = require('./helpers')
const renderers = require('./renderers')
const routingMethods = require('./routing_methods')

require('./install_native_nodes')

_.merge(partch, {
  configureNode: helpers.configureNode,
  install: renderers.install
})

function partch(audioContext) {
  const acdest = audioContext.destination
  
  // Clone the plan fn to avoid attaching attributes to it globally
  const planner = (...args) => plan(...args)

  _.merge(
    planner,
    renderers.vnodeFactories(planner),
    routingMethods,
    {
      audioContext,
      acdest,
      wrapRenderer: _.curry(renderers.wrap)(planner)
    }
  )
  
  return planner
}

module.exports = partch
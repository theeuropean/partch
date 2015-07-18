const _ = require('lodash')
const helpers = require('./helpers')

const renderers = {}

function install(renderer) {
  renderers[renderer.name] = renderer
}

function vnodeFactories(planner) {
  return _.mapValues(renderers, renderer => wrap(planner, renderer))
}

function wrap(planner, renderer) {
  const defaultId = renderer.defaultId || renderer.name

  function vnodeFn(...args) {
    // Get parameters of vNode from argument list
    const {
      options,
      firstString: id,
      firstNumber: defaultParamVal,
    } = helpers.parseArgs(args)

    // Attach attributes to fork function
    _.merge(fork, { defaultId, id, render, instruction: 'vnode' })

    function fork(...forkArgs) {
      const {
        options: forkOptions,
        firstString: forkId,
        firstNumber: forkDefaultParamVal,
      } = helpers.parseArgs(forkArgs)
      return vnodeFn(
        forkId || id,
        forkDefaultParamVal || defaultParamVal,
        _.merge({}, options, forkOptions)
      )
    }

    function render() {
      const node = renderer.render(planner, defaultParamVal, options)
      _.merge(node, { play })

      function play(dur) {
        if(node.start) {
          node.start()
          node.stop(planner.audioContext.currentTime + dur)
        }
      }

      return node
    }

    return fork
  }

  return vnodeFn
}

module.exports = { install, vnodeFactories, wrap }
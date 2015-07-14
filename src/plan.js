const _ = require('lodash')
const helpers = require('./helpers')

function plan(...args) {
  const {
    firstString: defaultId,
    functions: vnodes
  } = helpers.parseArgs(args)
  
  const vnodeMap = getVnodeMap()
  
  _.merge(fork, { defaultId, render })

  function fork(...args) {
    const { firstString: id, options } = helpers.parseArgs(args)
    const forkedVnodes = []
    for(let [vnodeId, vnode] of vnodeMap) {
      forkedVnodes.push(
        options[vnodeId] === undefined ? vnode : vnode(options[vnodeId])
      )
    }
    return plan(id || defaultId, ...forkedVnodes)
  }

  function render(options = {}) {
    let prevNode
    const nodes = vnodes.map(vnode => {
      const node = vnode.render()
      if(prevNode) prevNode.connect(node.input)
      prevNode = node
      return node
    })
    const lastNode = nodes[nodes.length - 1]
    if(options.connect) lastNode.connect(options.connect)

    function play(dur) {
      _.invoke(nodes, 'play', dur)
    }

    function connect(dest) {
      lastNode.connect(dest)
    }

    return {
      connect,
      play,
      input: nodes[0]
    }
  }

  function getVnodeMap() {
    const map = new Map()
    for(let vnode of vnodes) {
      const id = vnode.id || vnode.defaultId || '?'
      let uniqueId = id
      let i = 0
      while(map.has(uniqueId)) {
        i++
        uniqueId = id + '-' + i
      }
      map.set(uniqueId, vnode)
    }
    return map
  }

  return fork
}

module.exports = plan
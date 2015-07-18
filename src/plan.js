const _ = require('lodash')
const helpers = require('./helpers')

function plan(...args) {
  const {
    instructions,
    firstString: defaultId
  } = helpers.parseArgs(args)
  
  const vnodeMap = getVnodeMap()
  
  _.merge(fork, { defaultId, render, instruction: 'vnode' })

  function fork(...args) {
    const { firstString: id, options } = helpers.parseArgs(args)
    const forkedInstructions = instructions.map(instruction => {
      if(instruction.instruction === 'conn') return instruction
      const vnode = instruction
      const vnodeId = _.findKey(vnodeMap, vnode)
      if(options[vnodeId] === undefined) {
        return vnode
      }
      else {
        return vnode(options[vnodeId])          
      }
    })
    return plan(id || defaultId, ...forkedInstructions)
  }

  function render(options = {}) {
    let prevNode
    let inNode
    let outNode

    // FIXME this is big, ugly and brittle
    const nodes = _.compact(instructions.map((instruction, i) => {
      if(instruction.instruction === 'conn') {
        const conn = instruction
        if(conn.from === 'in') {
          inNode = instructions[i + 1]
        }
        if(conn.to === 'out') {
          outNode = instructions[i - 1]
        }
      }
      else {
        const vnode = instruction
        const node = vnode.render()
        if(prevNode) prevNode.connect(node.input)
        prevNode = node
        return node        
      }
    }))

    inNode = inNode || nodes[0]
    outNode = outNode || nodes[nodes.length - 1]
    if(options.connect) outNode.connect(options.connect)

    function play(dur) {
      _.invoke(nodes, 'play', dur)
    }

    function connect(dest) {
      outNode.connect(dest)
    }

    return {
      connect,
      play,
      input: inNode
    }
  }

  function getVnodeMap() {
    const map = {}
    instructions
      .filter(instr => instr.instruction === 'vnode')
      .forEach(vnode => {
        const id = vnode.id || vnode.defaultId || '?'
        let uniqueId = id
        let i = 0
        while(map[uniqueId]) {
          i++
          uniqueId = id + '-' + i
        }
        map[uniqueId] = vnode
      })
    return map
  }

  return fork
}

module.exports = plan
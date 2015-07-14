const _ = require('lodash')

function parseArgs(args) {
  const pa = {}
  pa.strings = args.filter(_.isString)
  pa.numbers = args.filter(_.isNumber)
  pa.options = _.merge({}, ...args.filter(_.isObject))
  pa.functions = args.filter(_.isFunction)
  pa.firstString = (pa.strings.length || undefined) && pa.strings[0]
  pa.firstNumber = (pa.numbers.length || undefined) && pa.numbers[0]
  return pa
}

// HACK
// This is essentially a version of _.merge that works with
// WAA native nodes (which aren't regular JS objects)
function configureNode(node, opts, path = '') {
  _.forIn(opts, (val, key) => {
    let thisPath = path + key
    if(_.isObject(val)) {
      configureNode(node, val, thisPath + '.')
    }
    else {
      const leaf = _.get(node, thisPath)
      if(leaf !== undefined) {
        // if leaf is an AudioParam set its value
        if(leaf.value !== undefined) {
          thisPath = thisPath + ".value"
        }
        _.set(node, thisPath, val)            
      }
    }
  })
}

module.exports = { parseArgs, configureNode }
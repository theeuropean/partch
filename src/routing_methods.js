const _ = require('lodash')

const _in = conn({ from: 'in' })
const out = conn({ to: 'out' })

function conn(options) {
  return _.merge({}, options, { instruction: 'conn' })
}

module.exports = { conn, out, in: _in }
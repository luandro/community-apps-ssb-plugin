const FlumeReduce = require('flumeview-reduce')
const ref = require('ssb-ref')
const merge = require('lodash/merge')

exports.name = 'apphub'
exports.version = require('./package.json').version
exports.manifest = {
  stream: 'source',
  get: 'async'
}

exports.init = function (ssb, config) {
  return ssb._flumeUse('apphub', FlumeReduce(1, reduce, map))
}

function reduce (result, item) {
  console.log('RED result', result)
  console.log('RED item', item)
  const timestamp = item.value.timestamp
  const name = item.value.content.application.name
  if (!result) result = []
  if (item) {
    // compare items with same name
    // get with largest timestamp
    for (var key in name) {
      console.log('value', key)
      // if (result[name] !== name) {
        // result = merge(result, item)
      // }
    }
    result.push(item)
  }
  return result
}

function map (msg) {
  if (msg.value.content && msg.value.content.type === 'open-app-hub-alpha') {
    // const name = msg.value.content.application.name
    // const author = msg.value.author
    // const timestamp = msg.value.timestamp
    // let values = {}

    for (var contentKey in msg.value.content) {
      if (contentKey !== 'application' && contentKey !== 'type') {
        values[contentKey] = {
          [name]: [msg.value.content[contentKey], msg.value.timestamp]
        }
      }
      if (contentKey === 'application') {
        // for (var appKey in msg.value.content.application) {
        //   values[appKey] = msg.value.content.application[appKey]
        //   values.author = author
        //   values.timestamp = timestamp
        // }
        return msg
      }
    }


    // console.log('Got', values)

    return null
  }
}

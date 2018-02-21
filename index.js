const flumeView = require('flumeview-reduce')
const pull = require('pull-stream')
const get = require('lodash/get')
const merge = require('lodash/merge')
const isEmpty = require('lodash/isEmpty')

const checkString = a => typeof a === 'string'

module.exports = {
  name: 'communityApps',
  version: '1.0.0',
  manifest: {
    get: 'async',
    stream: 'source'
  },
  init: function (ssbServer, config) {
    // console.log('*** loading app-installer plugin ***')

    const view = ssbServer._flumeUse('communityApps', flumeView(
      5.0, // version
      reduceData,
      mapToData,
      null, //codec
      initialState()
    ))
    // console.log('init FlumeView', view)

    return {
      get: view.get,
      stream: view.stream
    }
  }
}

function reduceData (acc, newData) {
  // https://lodash.com/docs/4.17.4#mergeWith
  // process.stdout.write('<3', acc, newData)
  // return mergeWith(acc, newData, (accVal, newVal) => {
  //   if (typeof accVal === 'number') {
  //     return accVal + newVal
  //   }
  // })
  // console.log('AC', acc)
  // console.log('new', newData)
  if (!isEmpty(newData)) {
    // console.log(merge(acc, newData))
    return merge(acc, newData)
  }
  return acc
}

function mapToData (msg) {
  // TODO - handle private message
  // TODO - check mentions are valid user keys

  const { author, content } = msg.value
  const key = msg.key
  const type = get(msg, 'value.content.type' ,[]) //map
  if (type === 'add-community-application') {
    const application = get(msg, 'value.content.application')
    const { name, package, readme } = application
    if (checkString(name) && checkString(package) && checkString(readme)) {
      return {
        [key]: {
          package,
          readme,
          name,
          author,
          key
        }
      }
    }
  }
  return {}
}

function initialState () {
  return {}
}
//
// main.js -- The entry program of RxJS examples
//
// by Song Younghwan <purluno@gmail.com>
//

'use strict'

var child_process = require('child_process')

var args = process.argv.slice(2)
if (args.length == 0) {
  console.log('Usage: node main <example-name> [<args> ...]')
  return
}
var name = args[0]
if (name.startsWith('dice')) {
  child_process.fork(`dice/${name}`, args.slice(1))
} else {
  child_process.fork(name, args.slice(1))
}

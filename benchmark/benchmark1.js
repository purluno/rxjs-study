//
// benchmark1.js -- a RxJS example
//
// by Song Younghwan <purluno@gmail.com>
//

'use strict'

var Rx = require('rx')

function random5() {
  return Math.random().toString(36).slice(2, 7)
}

var s1 = Rx.Observable.generate(
  null,
  () => true,
  () => null,
  random5
)

var s2 = Rx.Observable.from(function* () {
  while (true) {
    yield random5()
  }
}())

var s3 = Rx.Observable.just(null).doWhile(() => true).map(random5)

// (너무 느려서 제외)
// var s4 = Rx.Observable.interval().map(random5)

function benchmark(name, observable) {
  return observable.take(1000000)
    .last()
    .timeInterval()
    .map(result => ({name: name, result: result}))
}

var sum = {}

Rx.Observable.concat(
  benchmark('.generate()', s1),
  benchmark('.from()', s2),
  benchmark('.just().doWhile()', s3)
).repeat(5)
.do(x => sum[x.name] = (sum[x.name] || 0) + x.result.interval)
.map(x => JSON.stringify(x))
.subscribe(
  console.log,
  null,
  () => console.log(sum)
)

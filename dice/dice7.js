//
// dice7.js -- a RxJS example
//
// by Song Younghwan <purluno@gmail.com>
//

'use strict'

var Rx = require('rx')

// 주사위를 한번 던지는 비동기 observable.
// 1~6의 값을 가질 수 있는데 의도적인 버그로 인해 약 45.5% 확률로 실패할 수 있다.
// 한번 던지는데 300~350ms 정도 걸린다.
var diceRoll = Rx.Observable.create(observer => {
  setTimeout(() => {
    var dice = Math.floor(Math.random() * 11) // 0~10
    if (dice < 1 || 6 < dice) {
      observer.onError(new Error('A roll failed'))
    } else {
      observer.onNext(dice)
    }
    observer.onCompleted()
  }, 300 + Math.random() * 50)
})

// 주사위 던지기에 실패하면 성공할 때까지 최대 두번까지 더 던져본다.
var diceRollRetry = diceRoll.retry(3)

// 1초 이내에 주사위 던지기에 성공해야 한다.
var diceRollTimeout = diceRollRetry.timeout(1000)

// 주사위 던지기에 실패하면 주사위 값 대신 에러를 리턴한다.
var diceRollAndCatch = diceRollTimeout.catch(e => Rx.Observable.just(e))

// 주사위 던지기를 무한히 계속한다.
var infiniteDiceRolls = diceRollAndCatch.doWhile(() => true)

// 주사위를 던지는데 걸리는 시간을 구하여 결과에 포함시킨다. {value, interval}
var diceRollTimes = infiniteDiceRolls.timeInterval()

// 주사위 던진 값에 번호를 붙여준다.
var numberedDiceRolls = Rx.Observable.interval()
  .skip(1)
  .zip(diceRollTimes, (n, r) => ({id: n, value: r.value, interval: r.interval}))

// 주사위를 30회 던져 번호, 결과와 소요시간을 출력한다.
numberedDiceRolls.take(30).subscribe(x => {
  console.log(`${x.id}: ${x.value} (${x.interval} ms)`)
})

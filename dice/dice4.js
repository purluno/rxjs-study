//
// dice4.js -- a RxJS example
//
// by Song Younghwan <purluno@gmail.com>
//

'use strict'

var Rx = require('rx')

// 주사위를 한번 던지는 비동기 observable.
// 1~6의 값을 가질 수 있는데 의도적인 버그로 인해 약 40% 확률로 실패할 수 있다.
// 한번 던지는데 300~350ms 정도 걸린다.
var diceRoll = Rx.Observable.create(observer => {
  setTimeout(() => {
    var dice = Math.floor(Math.random() * 10) // 0~9
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

// 주사위 던지기에 실패하면 주사위 값 대신 에러를 리턴한다.
var diceRollAndCatch = diceRollRetry.catch(e => Rx.Observable.just(e))

// 주사위 던지기를 무한히 계속한다.
var infiniteDiceRolls = diceRollAndCatch.doWhile(() => true)

// 주사위를 30회 던져 결과를 출력한다.
infiniteDiceRolls.take(30).subscribe(x => {
  console.log(x)
})

//
// dice2.js -- a RxJS example
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

// 주사위 던지기를 무한히 계속한다.
var infiniteDiceRolls = diceRoll.doWhile(() => true)

// 주사위를 30회 던져 결과를 출력한다.
infiniteDiceRolls.take(30).subscribe(x => {
  console.log(x)
})

'use strict'

function execute() {
  conPrint("=== START ===")
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

  var diceRollRetry = diceRoll.retry(3)

  var diceRollTimeout = diceRollRetry.timeout(1000)

  var diceRollAndCatch = diceRollTimeout.catch(e => Rx.Observable.just(e))

  var infiniteDiceRolls = diceRollAndCatch.doWhile(() => true)

  var diceRollTimes = infiniteDiceRolls.timeInterval()

  var numbers = function* () {
    var i = 1
    while (true) { yield i; i += 1 }
  }()

  var numberedDiceRolls = diceRollTimes.map(x => {
    return {
      id: numbers.next().value,
      value: x.value,
      interval: x.interval
    }
  })

  numberedDiceRolls.take(30).subscribe(x => {
    conPrint(`${x.id}: ${x.value} (${x.interval} ms)`)
  })
}

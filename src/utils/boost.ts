import { LockHistory } from './lock'

export const floorNumber = (num: number, digits: number) => {
  const decimal = Math.pow(10, digits)
  return Math.floor(num * decimal) / decimal
}

export const getTokenBoost = (amountLocked: number) => {
  if (amountLocked <= 100) {
    return 0
  }
  if (amountLocked <= 1_000) {
    return amountLocked / 900 - 1 / 9
  }
  if (amountLocked < 10_000) {
    return amountLocked / 9000 + 8 / 9
  }
  if (amountLocked < 100_000) {
    return amountLocked / 90000 + 17 / 9
  }
  if (amountLocked < 1_000_000) {
    return amountLocked / 900000 + 26 / 9
  }
  return 4
}

export const getTimeFactor = (days: number) => {
  if (days < 0) {
    return 0
  }

  if (days <= 47) {
    return 1 - 0.0106383 * days
  }

  if (days <= 158) {
    return 0.5 - 0.0045045 * (days - 48)
  }

  return 0
}

type LockInterval = {
  start: number
  end: number
  amount: number
}

export const getBoostFunction =
  (now: number, amountDiff: number, history: LockHistory[]) =>
  (d: { x: number }): number => {
    // Add new boost to history
    const newHistory: LockHistory[] = [...history, { amount: amountDiff, day: now }]

    // Filter out all entries that were made before the current day (x)
    const filteredHistory = newHistory.filter((entry) => entry.day <= d.x)
    const lockIntervals: LockInterval[] = []

    // We transform it into intervals
    for (let idx = 0; idx < filteredHistory.length; idx++) {
      const currentEvent = filteredHistory[idx]
      let nextEvent: LockHistory | undefined = undefined
      if (filteredHistory.length > idx + 1) {
        nextEvent = filteredHistory[idx + 1]
      }

      const previousInterval = lockIntervals.length > 0 ? lockIntervals[lockIntervals.length - 1] : undefined

      lockIntervals.push({
        start: Math.max(currentEvent.day, 0),
        amount: currentEvent.amount + (previousInterval?.amount ?? 0),
        end: Math.max(nextEvent?.day ?? d.x, 0),
      })
    }

    // Compute and add the boost for each interval + 1
    return lockIntervals.reduce((prev, current) => {
      return prev + getTokenBoost(current.amount) * (getTimeFactor(current.start) - getTimeFactor(current.end))
    }, 1)
  }

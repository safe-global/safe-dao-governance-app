import { getTime } from 'date-fns'
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
    return amountLocked * 0.000277778 - 0.0277778
  }
  if (amountLocked < 10_000) {
    return amountLocked * 0.0000277778 + 0.222222
  }
  if (amountLocked < 100_000) {
    return amountLocked * 5.55556 * 10 ** -6 + 0.444444
  }
  return 1
}

export const getTimeFactor = (days: number) => {
  if (days <= 27) {
    return 1
  }

  if (days <= 150) {
    return 1 - (days - 27) / 133
  }

  return 0
}

/**
 *
 * @param now today in days since begin of program
 * @param amountDiff user entered amount in the app
 * @param history lock history
 * @returns
 */
export const getBoostFunction =
  (now: number, amountDiff: number, history: LockHistory[]) =>
  (d: { x: number }): number => {
    // Add new boost to history
    const newHistory: LockHistory[] = [...history, { amount: amountDiff, day: now }]

    // Filter out all entries that were made after the current day (x)
    const filteredHistory = newHistory.filter((entry) => entry.day <= d.x)
    const firstLock: LockHistory | undefined = filteredHistory[0]
    const timeFactor_firstLock = firstLock ? getTimeFactor(firstLock.day) : 1
    let currentBoost = 1
    let lockedAmount = 0
    for (let i = 0; i < filteredHistory.length; i++) {
      const currentEvent = filteredHistory[i]
      lockedAmount = lockedAmount + currentEvent.amount

      if (currentEvent.amount >= 0) {
        // For the first lock we need to only consider the time factor of today so we divide by 1
        const relativeTimeFactor = i === 0 ? 1 : timeFactor_firstLock
        // handle lock event
        const adjustedBoost = timeFactor_firstLock * getTokenBoost(lockedAmount) + 1
        const timeFactor_lock = getTimeFactor(currentEvent.day)
        currentBoost = currentBoost + (adjustedBoost - currentBoost) * (timeFactor_lock / relativeTimeFactor)
      } else {
        // handle unlock
        currentBoost = getTokenBoost(lockedAmount) * getTimeFactor(currentEvent.day) + 1
      }
    }

    // Compute and add the boost for each interval + 1
    return currentBoost
  }

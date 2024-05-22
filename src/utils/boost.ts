import { LockHistory } from './lock'

const MAX_AMOUNT = 100_000

export const floorNumber = (num: number, digits: number) => {
  const decimal = Math.pow(10, digits)
  return Math.floor(num * decimal) / decimal
}

export const getTokenBoost = (amountLocked: number) => {
  if (isNaN(amountLocked) || amountLocked <= 100) {
    return 0
  }
  if (amountLocked <= 1_000) {
    return amountLocked * 0.000277778 - 0.0277778
  }
  if (amountLocked <= 10_000) {
    return amountLocked * 0.0000277778 + 0.222222
  }
  if (amountLocked < 100_000) {
    return amountLocked * 5.55556 * 10 ** -6 + 0.444444
  }
  return 1
}

export const getTimeFactor = (days: number) => {
  if (days <= 33) {
    return 1
  }

  return Math.max(0, 1 - (days - 33) / 127)
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
    const newHistory: LockHistory[] = [...history, { amount: isNaN(amountDiff) ? 0 : amountDiff, day: now }]

    // Filter out all entries that were made after the current day (x)
    const filteredHistory = newHistory.filter((entry) => entry.day <= d.x)
    let currentBoost = 1
    let lockedAmount = 0
    for (let i = 0; i < filteredHistory.length; i++) {
      const currentEvent = filteredHistory[i]
      const prevLockedAmount = lockedAmount
      lockedAmount = lockedAmount + currentEvent.amount

      if (currentEvent.amount >= 0) {
        // For the first lock we need to only consider the time factor of today so we divide by 1
        // handle lock event
        const boostGain = getTokenBoost(lockedAmount) - getTokenBoost(prevLockedAmount)
        const timeFactorLock = getTimeFactor(currentEvent.day)
        currentBoost = currentBoost + boostGain * timeFactorLock
      } else {
        // handle unlock
        if (lockedAmount < MAX_AMOUNT) {
          currentBoost = getTokenBoost(lockedAmount) * getTimeFactor(currentEvent.day) + 1
        }
      }
    }

    // Compute and add the boost for each interval + 1
    return currentBoost
  }
